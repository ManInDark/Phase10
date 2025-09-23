import React, { createContext } from 'react';
import { GameVariants } from './Variants';

export const VariantContext = createContext<GameVariants>(GameVariants.Phase10);

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
  getRoundResult(variant: GameVariants, i: number) {
    const round: Round = this.rounds[i];
    switch (variant) {
      case 'Phase10':
        return (
          <React.Fragment key={`RR-${i}-${this.getUUID()}`}>
            <td>{round.points}</td>
            <td><input type="checkbox" checked={round.phaseDone} readOnly={true} /></td>
          </React.Fragment>
        );
    }
  }
  getPhase() { return 1 + this.rounds.filter(r => r.phaseDone).length; }
  getPhaseDisplay() { return Math.min(10, this.getPhase()); }
  getAccumulatedPoints(variant: GameVariants) {
    let colspan = 0;
    switch (variant) {
      case 'Phase10':
        colspan = 2;
        break;
    }
    return (
      <td key={"accumulatedPoints" + this.getUUID()} colSpan={colspan}>
        {this.rounds.reduce((prev, curr) => prev + curr.points, 0)}
      </td>
    )
  }
  getTableHeader(variant: GameVariants) {
    switch (variant) {
      case 'Phase10':
        return (
          <React.Fragment key={this.getUUID()}>
            <th>{this.getName()}</th>
            <th>{this.getPhaseDisplay()}</th>
          </React.Fragment>
        )
    }
  }
}

export function getRoundsPlayed(playerData: Player[]): number {
  return playerData.reduce((prev: number, curr: Player) => { return Math.min(prev, curr.getRounds().length) }, playerData.length * 25)
}

export function getFinished(playerData: Player[]): boolean {
  return playerData.reduce((prev: number, curr: Player) => { return Math.max(prev, curr.getPhase()) }, 0) > 10;
}