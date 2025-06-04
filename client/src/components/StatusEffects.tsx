import React from 'react';
import { IStatusEffect } from '../../../shared/types/game';
import './StatusEffects.css';

interface StatusEffectsProps {
  effects: IStatusEffect[];
}

const StatusEffects: React.FC<StatusEffectsProps> = ({ effects }) => {
  return (
    <div className="status-effects">
      {effects.map((effect, index) => (
        <div key={index} className={`status-effect ${effect.type.toLowerCase()}`}>
          <div className="effect-name">{effect.name}</div>
          <div className="effect-duration">残り{effect.duration}ターン</div>
          <div className="effect-description">{effect.description}</div>
        </div>
      ))}
    </div>
  );
};

export default StatusEffects; 