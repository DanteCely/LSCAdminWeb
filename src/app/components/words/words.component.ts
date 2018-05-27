import { Component, OnInit, Inject } from '@angular/core';
import {
  MatTableDataSource,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar
} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import { ProxyWordsService } from '../../services/proxy-words.service';
import { Word } from '../../word';
import { NewWord } from '../../new-word';
import { MediaWord } from '../../media-word';
import { Test } from '../../test';

@Component({
  selector: 'app-words',
  templateUrl: './words.component.html',
  styleUrls: ['./words.component.css']
})
export class WordsComponent implements OnInit {
  words: Word[];
  newWord: NewWord;
  mediaWord: MediaWord;

  // ****** Table Elements ******
  displayedColumns = ['Palabra', 'Nivel', 'Leccion', 'Media', 'Funcion'];
  dataSource;

  constructor(
    private proxyService: ProxyWordsService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {
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

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  // ******* Modal Multimedia *******
  openDialog(word: Word): void {
    const dialogRef = this.dialog.open(ShowVideoDialog, {
      width: '700px',
      data: {
        palabra: word.word,
        videoURL: word.video,
        pictureURL: word.picture
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The multimedia-dialog was closed');
    });
  }

  // ******* Modal Edit *******
  editDialog(word: Word): void {
    const dialogRef = this.dialog.open(EditWordDialog, {
      width: '700px',
      data: {
        palabra: word.word,
        nivel: word.level,
        leccion: word.lesson,
        videoURL: word.video,
        pictureURL: word.picture
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The edit-dialog was closed');
      /*console.log(result.palabra);
      console.log(result.nivel);
      console.log(result.leccion);*/
    });
  }

  onFileVideo(event) {
    // console.log(event.target.files[0]);
    if (event.target.files[0]) {
      this.mediaWord.videoFile = <File>event.target.files[0];
      this.mediaWord.videoName = event.target.files[0].name;
    } else {
      this.mediaWord.videoName = '';
    }
  }

}
export class TooltipOverviewExample {}

// ******* Modal Multimedia dialog *******
@Component({
  selector: 'app-show-video-dialog',
  templateUrl: './show-video-dialog.html'
})

// tslint:disable-next-line:component-class-suffix
export class ShowVideoDialog {
  constructor(
    public dialogRef: MatDialogRef<ShowVideoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

// ******* Modal edit word dialog *******
@Component({
  selector: 'app-edit-word-dialog',
  templateUrl: './edit-word-dialog.html',
  styleUrls: ['./edit-word-dialog.css']
})

// tslint:disable-next-line:component-class-suffix
export class EditWordDialog {
  // ****** Validation Elements *******
  levelControl = new FormControl('', [Validators.required]);
  levels_lessons = [
    {lesson: 'Abecedario', level: 'Abecedario y números'},
    {lesson: 'Números', level: 'Abecedario y números'},
    {lesson: 'Pronombres', level: 'Sustantivos'},
    {lesson: 'Relaciones', level: 'Sustantivos'},
    {lesson: 'Actividades cotidianas', level: 'Verbos'},
    {lesson: 'En el estudio', level: 'Verbos'},
    {lesson: 'Lugares', level: 'Predicados'},
    {lesson: 'Tiempos', level: 'Predicados'},
  ];
  selectedValue: string;

  constructor(
    public dialogRef: MatDialogRef<EditWordDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
