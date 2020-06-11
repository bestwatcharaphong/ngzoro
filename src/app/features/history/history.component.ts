import { Component, OnInit } from '@angular/core';
import { History } from 'src/app/shared/models/history.model';
import { ImportService } from 'src/app/shared/services/import.service';

interface Result {
  result: any;
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  historyData: Array<History>;

  constructor(private importService: ImportService) {}

  ngOnInit(): void {
    this.importService.getImportHistory().subscribe((resp: Result) => {
      console.log(resp);
      this.historyData = resp.result as Array<History>;
    });
  }
}
