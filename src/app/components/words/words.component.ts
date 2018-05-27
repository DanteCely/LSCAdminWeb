import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProxyWordsService } from '../../services/proxy-words.service';
import { Word } from '../../word';
import { NewWord } from '../../new-word';
import { Test } from '../../test';

@Component({
  selector: 'app-words',
  templateUrl: './words.component.html',
  styleUrls: ['./words.component.css']
})
export class WordsComponent implements OnInit {
  words: Word[];
/* Cargar video
  selectedVideo: File = null;
  nameVideo: string = null;
*/
  displayedColumns = ['Palabra', 'Nivel', 'Leccion', 'Video', 'Imagen', 'Funcion'];
  dataSource;

  constructor(private proxyService: ProxyWordsService) {
    this.proxyService.getWords().subscribe(
      result => {
        if (result.code !== 200) {
          this.words = result;
          this.dataSource = new MatTableDataSource( this.words );
        } else {

        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  ngOnInit() { }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
/*
  onFileVideo(event) {
    // console.log(event.target.files[0]);
    if (event.target.files[0]) {
      this.selectedVideo = <File>event.target.files[0];
      this.nameVideo = event.target.files[0].name;
    } else {
      this.nameVideo = '';
    }
  }
*/

}

export class TooltipOverviewExample {}
