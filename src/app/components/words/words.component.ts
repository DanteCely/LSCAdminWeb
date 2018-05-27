import { Component, OnInit, Inject } from '@angular/core';
import {
  MatTableDataSource,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';
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
  displayedColumns = [
    'Palabra',
    'Nivel',
    'Leccion',
    'Media',
    'Funcion'
  ];
  dataSource;

  animal: string;
  name: string;

  constructor(private proxyService: ProxyWordsService, public dialog: MatDialog) {
    this.proxyService.getWords().subscribe(
      result => {
        if (result.code !== 200) {
          this.words = result;
          this.dataSource = new MatTableDataSource(this.words);
        } else {
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  ngOnInit() {}

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

// Modal video
  openDialog( word: Word ): void {
    const dialogRef = this.dialog.open(ShowVideoDialog, {
      width: '700px',
      data: { palabra: word.word, videoURL: word.video, pictureURL: word.picture }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
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

// Modal video dialog
@Component({
  selector: 'app-show-video-dialog',
  templateUrl: './show-video-dialog.html',
})

// tslint:disable-next-line:component-class-suffix
export class ShowVideoDialog {

  constructor(
    public dialogRef: MatDialogRef<ShowVideoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
