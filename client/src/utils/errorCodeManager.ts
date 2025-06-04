import { 
  ErrorCodeInfo, 
  ErrorCategory, 
  ErrorSeverity, 
  ErrorDetails,
  ERROR_CODE_FORMAT,
  SubCategories,
  NetworkSubCategory,
  GameSubCategory,
  CardSubCategory,
  PlayerSubCategory,
  SystemSubCategory,
  InfoSubCategory
} from '../../../shared/types/error';

type SubCategoryType = 
  | NetworkSubCategory
  | GameSubCategory
  | CardSubCategory
  | PlayerSubCategory
  | SystemSubCategory
  | InfoSubCategory;

export class ErrorCodeManager {
  private static instance: ErrorCodeManager;
  private sequenceCounters: Record<string, number> = {};

  private constructor() {
    // 各カテゴリーのシーケンスカウンターを初期化
    (Object.keys(ERROR_CODE_FORMAT.SUB_CATEGORIES) as ErrorCategory[]).forEach(category => {
      const subCategories = ERROR_CODE_FORMAT.SUB_CATEGORIES[category];
      Object.keys(subCategories).forEach(subCategory => {
        this.sequenceCounters[`${category}_${subCategory}`] = 0;
      });
    });
  }

  static getInstance(): ErrorCodeManager {
    if (!ErrorCodeManager.instance) {
      ErrorCodeManager.instance = new ErrorCodeManager();
    }
    return ErrorCodeManager.instance;
  }

  generateErrorCode(
    category: ErrorCategory,
    subCategory: SubCategoryType,
    severity: ErrorSeverity
  ): string {
    const categoryPrefix = ERROR_CODE_FORMAT[category] as string;
    const subCategories = ERROR_CODE_FORMAT.SUB_CATEGORIES[category];
    const subCategoryCode = subCategories[subCategory as keyof typeof subCategories];
    
    if (!categoryPrefix || !subCategoryCode) {
      throw new Error(`Invalid category (${category}) or subcategory (${subCategory})`);
    }

    const counterKey = `${category}_${subCategory}`;
    this.sequenceCounters[counterKey] = (this.sequenceCounters[counterKey] + 1) % 1000;
    const sequence = this.sequenceCounters[counterKey].toString().padStart(3, '0');

    return `${categoryPrefix}${subCategoryCode}${sequence}`;
  }

  parseErrorCode(code: string): ErrorCodeInfo {
    const category = this.getCategoryFromCode(code);
    const subCategory = this.getSubCategoryFromCode(code);
    const sequence = parseInt(code.slice(-3));
    const severity = this.getSeverityFromCategory(category);

    return {
      category,
      subCategory,
      sequence,
      severity
    };
  }

  private getCategoryFromCode(code: string): ErrorCategory {
    const prefix = code.charAt(0);
    for (const [category, categoryPrefix] of Object.entries(ERROR_CODE_FORMAT)) {
      if (categoryPrefix === prefix && category !== 'SUB_CATEGORIES') {
        return category as ErrorCategory;
      }
    }
    throw new Error(`Invalid error code prefix: ${prefix}`);
  }

  private getSubCategoryFromCode(code: string): string {
    const subCategoryCode = code.slice(1, 4);
    const category = this.getCategoryFromCode(code);
    
    const subCategories = ERROR_CODE_FORMAT.SUB_CATEGORIES[category];
    for (const [subCategory, code] of Object.entries(subCategories)) {
      if (code === subCategoryCode) {
        return subCategory;
      }
    }
    throw new Error(`Invalid subcategory code: ${subCategoryCode}`);
  }

  private getSeverityFromCategory(category: ErrorCategory): ErrorSeverity {
    switch (category) {
      case 'INFO':
        return 'INFO';
      case 'NETWORK':
      case 'GAME':
      case 'CARD':
      case 'PLAYER':
      case 'SYSTEM':
        return 'ERROR';
      default:
        return 'WARNING';
    }
  }

  getErrorDetails(code: string): ErrorDetails {
    const info = this.parseErrorCode(code);
    return {
      timestamp: Date.now(),
      context: {
        component: info.category,
        action: info.subCategory
      }
    };
  }

  searchErrorsByCategory(category: ErrorCategory): string[] {
    return Object.keys(this.sequenceCounters)
      .filter(key => key.startsWith(category))
      .map(key => {
        const [cat, subCat] = key.split('_');
        return this.generateErrorCode(
          cat as ErrorCategory,
          subCat as SubCategoryType,
          this.getSeverityFromCategory(cat as ErrorCategory)
        );
      });
  }

  searchErrorsBySubCategory(
    category: ErrorCategory,
    subCategory: SubCategoryType
  ): string[] {
    const key = `${category}_${subCategory}`;
    if (this.sequenceCounters[key] === undefined) {
      return [];
    }

    return [
      this.generateErrorCode(
        category,
        subCategory,
        this.getSeverityFromCategory(category)
      )
    ];
  }
} 