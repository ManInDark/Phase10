import React, { createContext } from 'react';
import { GameVariants } from './Variants';

export const VariantContext = createContext<GameVariants>(GameVariants.Phase10);

export class Round {
  points: number;
  constructor(points: Round["points"]) {
    this.points = points;
  }
}

export class Phase10Round extends Round {
  phaseDone: boolean;
  constructor(points: Round["points"], phaseDone: Phase10Round["phaseDone"]) {
    super(points);
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
  addRound<K extends Round>(data: K) { this.rounds.push(data); }
  getRounds() { return this.rounds; }
  getRoundResult(variant: GameVariants, i: number) {
    const round: Round = this.rounds[i];
    switch (variant) {
      case 'Phase10':
        return (
          <React.Fragment key={`RR-${i}-${this.getUUID()}`}>
            <td>{round.points}</td>
            <td><input type="checkbox" checked={(round as Phase10Round).phaseDone} readOnly={true} /></td>
          </React.Fragment>
        );
      case "Standard":
        return (
          <React.Fragment key={`RR-${i}-${this.getUUID()}`}>
            <td>{round.points}</td>
          </React.Fragment>
        )
    }
  }
  getPhase() { return 1 + this.rounds.filter(r => (r as Phase10Round).phaseDone).length; }
  getPhaseDisplay() { return Math.min(10, this.getPhase()); }
  getAccumulatedPoints(variant: GameVariants) {
    return (
      <td key={"accumulatedPoints" + this.getUUID()} colSpan={variantWidth(variant)}>
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
      case "Standard":
        return (
          <React.Fragment key={this.getUUID()}>
            <th>{this.getName()}</th>
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

export function variantWidth(variant: GameVariants): number {
  switch (variant) {
    case 'Phase10':
      return 2;
    case "Standard":
      return 1;
  }
}

export function variantClassWidth(variant: GameVariants): string {
  switch (variantWidth(variant)) {
    case 1: return "onespan";
    case 2: return "twospan";
    default: return "";
  }
}