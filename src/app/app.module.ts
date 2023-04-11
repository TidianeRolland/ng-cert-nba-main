import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TeamStatsComponent } from './team-stats/team-stats.component';
import { FormsModule } from '@angular/forms';
import { GameResultsComponent } from './game-results/game-results.component';
import { GameStatsComponent } from './game-stats/game-stats.component';
import { ModalComponent } from './ui/confirm-modal/modal/modal.component';
import { ConfirmModalModule } from './ui/confirm-modal/confirm-modal.module';

@NgModule({
  declarations: [
    AppComponent,
    TeamStatsComponent,
    GameResultsComponent,
    GameStatsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ConfirmModalModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
