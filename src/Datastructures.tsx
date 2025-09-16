import React from 'react';

export class Round {
  points: number;
  phaseDone: boolean;
  constructor(points: Round["points"], phaseDone: Round["phaseDone"]) {
    this.points = points;
    this.phaseDone = phaseDone;
  }
}

export class Player {
  private name: string;
  private rounds: Round[];
  private uuid: string;
  constructor(name: string) {
    this.name = name;
    this.rounds = [];
    this.uuid = crypto.randomUUID();
  }
  getName() { return this.name; }
  getUUID() { return this.uuid; }
  addRound(points: Round["points"], phaseDone: Round["phaseDone"]) { this.rounds.push(new Round(points, phaseDone)); }
  getRounds() { return this.rounds; }
  getRoundResult(i: number) {
    const round: Round = this.rounds[i];
    return (
      <React.Fragment key={`RR-${i}-${this.getUUID()}`}>
        <td>{round.points}</td>
        <td><input type="checkbox" checked={round.phaseDone} readOnly={true} /></td>
      </React.Fragment>
    );
  }
  getPhase() { return 1 + this.rounds.filter(r => r.phaseDone).length; }
  getPhaseDisplay() { return Math.min(10, this.getPhase()); }
  getAccumulatedPoints() { return this.rounds.reduce((prev, curr) => prev + curr.points, 0); }
}

export function getRoundsPlayed(playerData: Player[]): number {
  return playerData.reduce((prev: number, curr: Player) => { return Math.min(prev, curr.getRounds().length) }, playerData.length * 25)
}

export function getFinished(playerData: Player[]): boolean {
  return playerData.reduce((prev: number, curr: Player) => { return Math.max(prev, curr.getPhase()) }, 0) > 10;
}