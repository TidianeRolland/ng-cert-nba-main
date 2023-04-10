import { Component } from '@angular/core';
import { OptionItem, Team } from '../data.models';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  map,
  shareReplay,
  tap,
} from 'rxjs';
import { NbaService } from '../nba.service';

@Component({
  selector: 'app-game-stats',
  templateUrl: './game-stats.component.html',
  styleUrls: ['./game-stats.component.css'],
})
export class GameStatsComponent {
  private teams$: Observable<Team[]>;
  allTeams: Team[] = [];

  conferences$: Observable<OptionItem[]>;
  conferenceSubj = new BehaviorSubject<string | 'NO_FILTER'>('NO_FILTER');
  conferenceSubj$ = this.conferenceSubj.asObservable().pipe(shareReplay(1));

  divisions$: Observable<OptionItem[]>;
  divisionSubj = new BehaviorSubject<string | 'NO_FILTER'>('NO_FILTER');
  divisionSubj$ = this.divisionSubj.asObservable();

  finalTeams$: Observable<Team[]>;

  private readonly NO_FILTER_OPTION = { name: '', value: 'NO_FILTER' };

  constructor(protected nbaService: NbaService) {
    this.teams$ = nbaService.getAllTeams().pipe(
      tap((data) => (this.allTeams = data)),
      shareReplay(1)
    );

    this.conferences$ = this.teams$.pipe(
      map((teams) => {
        const conferencesString: string[] = [
          ...new Set(teams.map((team) => team.conference)),
        ];

        const conferences = conferencesString.map((conf) => ({
          name: `${conf}ern Conference`,
          value: conf,
        }));

        return [{ ...this.NO_FILTER_OPTION }, ...conferences];
      })
    );

    this.divisions$ = combineLatest([this.conferenceSubj$, this.teams$]).pipe(
      map(([confValue, teams]) => {
        const mapFn = (team: Team) => ({
          name: `${team.division} Division`,
          value: team.division,
        });

        const divisions =
          confValue !== 'NO_FILTER'
            ? teams.filter((team) => team.conference === confValue).map(mapFn)
            : teams.map(mapFn);

        this.divisionSubj.next('NO_FILTER');
        return [
          { ...this.NO_FILTER_OPTION },
          ...this.getUniqueDivisions(divisions),
        ];
      })
    );

    this.finalTeams$ = combineLatest([
      this.conferenceSubj$,
      this.divisionSubj$,
      this.teams$,
    ]).pipe(
      map(([confSelected, divisionSelected, teams]) => {
        let filteredTeams: Team[] = teams;

        if (divisionSelected !== 'NO_FILTER')
          filteredTeams = [
            ...teams.filter((team) => team.division === divisionSelected),
          ];
        else if (confSelected !== 'NO_FILTER')
          filteredTeams = [
            ...teams.filter((team) => team.conference === confSelected),
          ];

        return this.getUniqueTeams(filteredTeams);
      })
    );
  }

  trackTeam(teamId: string): void {
    let team = this.allTeams.find((team) => team.id == Number(teamId));
    if (team) this.nbaService.addTrackedTeam(team);
  }

  onConferenceSelected(conference: string) {
    this.conferenceSubj.next(conference);
  }

  onDivisionSelected(division: string) {
    this.divisionSubj.next(division);
  }

  getUniqueDivisions(arr: OptionItem[], key: 'value' = 'value') {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  getUniqueTeams(arr: Team[], key: 'name' = 'name') {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }
}
