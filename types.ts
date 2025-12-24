
export enum AppState {
  IDLE = 'IDLE',
  CHARGING = 'CHARGING',
  EXPLODING = 'EXPLODING',
  REVEALED = 'REVEALED'
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
}

export interface BulletComment {
  id: number;
  text: string;
  color: string;
  top: number;
  duration: number;
}
