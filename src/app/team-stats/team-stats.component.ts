import { Component, Input, OnInit } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { NbaService } from '../nba.service';
import { Game, Stats, Team } from '../data.models';
import { ConfirmationService } from '../ui/confirm-modal/confirmation.service';

@Component({
  selector: 'app-team-stats',
  templateUrl: './team-stats.component.html',
  styleUrls: ['./team-stats.component.css'],
  providers: [ConfirmationService],
})
export class TeamStatsComponent implements OnInit {
  @Input()
  team!: Team;

  games$!: Observable<Game[]>;
  stats!: Stats;
  numberOfDays$ = this.nbaService.numberOfDays$;
  constructor(
    protected nbaService: NbaService,
    private confirmServ: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.games$ = this.numberOfDays$.pipe(
      switchMap((numberOfDays: number) =>
        this.nbaService.getLastResults(this.team, numberOfDays)
      ),
      tap(
        (games) =>
          (this.stats = this.nbaService.getStatsFromGames(games, this.team))
      )
    );
  }

  onRemoveTeam(team: Team) {
    this.confirmServ.confirm({
      header: '<b>Header from service</b>',
      body: 'Are you sure you want to remove ?',
      accept: () => {
        this.nbaService.removeTrackedTeam(team);
      },
      reject: () => {
        console.log('you rejected');
      },
    });
  }
}
