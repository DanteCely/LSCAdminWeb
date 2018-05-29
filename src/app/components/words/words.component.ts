import { Component, OnInit, Inject } from '@angular/core';
import {
  MatTableDataSource,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar
} from '@angular/material';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProxyWordsService } from '../../services/proxy-words.service';
import { Word } from '../../word';
import { NewWord } from '../../new-word';
import { MediaWord } from '../../media-word';
import { URLFile } from '../../urlfile';
import { Test } from '../../test';

@Component({
  selector: 'app-words',
  templateUrl: './words.component.html',
  styleUrls: ['./words.component.css']
})
export class WordsComponent implements OnInit {
  words: Word[];
  newWord: NewWord;

  // ************************************ Table Elements ************************************
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
      duration: 2000
    });
  }

  // ************************************* Modal Multimedia *************************************
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

  // ************************************* Modal Edit *************************************
  editDialog(word: Word): void {
    const dialogRef = this.dialog.open(EditWordDialog, {
      width: '400px',
      data: {
        palabra: word.word,
        nivel: '',
        leccion: '',
        videoURL: '',
        pictureURL: ''
      }
    });
    let wordUpdate: Word = null;
    dialogRef.afterClosed().subscribe((result: Word) => {
      if (typeof result !== 'undefined') {
        wordUpdate = result;
        console.log(wordUpdate);
        // Eliminar video y foto antigua
      }
    });
  }
}
export class TooltipOverviewExample {}

// ************************************* Modal Multimedia dialog *************************************
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

// ************************************* Modal edit word dialog *************************************
@Component({
  selector: 'app-edit-word-dialog',
  templateUrl: './edit-word-dialog.html',
  styleUrls: ['./edit-word-dialog.css']
})

// tslint:disable-next-line:component-class-suffix
export class EditWordDialog {
  mediaWord: MediaWord = {
    videoFile: null,
    videoName: '',
    pictureFile: null,
    pictureName: ''
  };
  urlVideo: URLFile = null;
  urlPicture: URLFile = null;
  // ************************************ Validation Elements *************************************
  levelControl = new FormControl('', [Validators.required]);
  levels_lessons = [
    { lesson: 'Abecedario', level: 'Abecedario y números' },
    { lesson: 'Números', level: 'Abecedario y números' },
    { lesson: 'Pronombres', level: 'Sustantivos' },
    { lesson: 'Relaciones', level: 'Sustantivos' },
    { lesson: 'Actividades cotidianas', level: 'Verbos' },
    { lesson: 'En el estudio', level: 'Verbos' },
    { lesson: 'Lugares', level: 'Predicados' },
    { lesson: 'Tiempos', level: 'Predicados' }
  ];
  wordControl = new FormControl('', [Validators.required]);
  TypeVideo = 'video/mp4';
  TypePicture = 'image/jpeg';
  ErrFileType = 'Archivo no aceptado';
  ErrDescripVideo = 'El tipo de archivo tiene que ser .mp4';
  ErrDescripPicture = 'El tipo de archivo tiene que ser .jpg';

  constructor(
    private proxyService: ProxyWordsService,
    public dialogRef: MatDialogRef<EditWordDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar
  ) {
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onClick(): void {
    console.log(':)');
  }

  onFileVideo(event) {
    // Validar tipos de archivo .mp4
    if (event.target.files[0]) {
      if (event.target.files[0].type === this.TypeVideo) {
        this.mediaWord.videoFile = <File>event.target.files[0];
        this.mediaWord.videoName = event.target.files[0].name;
      } else {
        this.openSnackBar(this.ErrFileType, this.ErrDescripVideo);
      }
    } else {
      this.mediaWord.videoFile = null;
      this.mediaWord.videoName = '';
    }
  }

  onFilePicture(event) {
    // Validar tipos de archivo
    if (event.target.files[0]) {
      if (event.target.files[0].type === this.TypePicture) {
        this.mediaWord.pictureFile = <File>event.target.files[0];
        this.mediaWord.pictureName = event.target.files[0].name;
      } else {
        this.openSnackBar(this.ErrFileType, this.ErrDescripPicture);
      }
    } else {
      this.mediaWord.pictureFile = null;
      this.mediaWord.pictureName = '';
    }
  }

  validar(word) {
    // Validar campos completos
    const goodWord = word.palabra !== '' && word.palabra !== null;
    const goodLevel = word.nivel !== '' && word.nivel !== null;
    const goodLesson = word.leccion !== '' && word.leccion !== null;
    const goodVideo =
      this.mediaWord.videoName !== '' && this.mediaWord.videoFile !== null;
    const goodPicture =
      this.mediaWord.pictureName !== '' && this.mediaWord.pictureFile !== null;

      return goodWord && goodLevel && goodLesson && goodVideo && goodPicture;
  }

  addFiles(word) {
    // Video e imagen para agregar
    const newVideo: FormData = new FormData();
    const newPicture: FormData = new FormData();

    // Cambiar nombre de video e imagen
    this.mediaWord.videoName = `${word.palabra}.mp4`;
    this.mediaWord.pictureName = `${word.palabra}.jpg`;
    const espacios = /\ /gi;
    const nuevoValor = '+';
    this.mediaWord.videoName = this.mediaWord.videoName.replace(espacios, nuevoValor);
    this.mediaWord.pictureName = this.mediaWord.pictureName.replace(espacios, nuevoValor);

    // Empacar video e imagen
    newVideo.append( 'videoFile', this.mediaWord.videoFile, this.mediaWord.videoName.toLowerCase() );
    newPicture.append( 'pictureFile', this.mediaWord.pictureFile, this.mediaWord.pictureName.toLowerCase() );
    // agregar video e imagen para recibir URL (POST)
    // ************************************ Agregar Video ************************************
    this.proxyService.addVideo( newVideo ).subscribe(
      result => {
        if (result.code !== 200) {
          console.log(result);
           this.urlVideo = result;
        } else {
        }
      },
      error => {
        console.log(<any>error);
      }
    );
    // ************************************ Agregar Imagen ************************************
    this.proxyService.addPicture( newPicture ).subscribe(
      result => {
        if (result.code !== 200) {
          console.log(result);
           this.urlPicture = result;
        } else {
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  funcion () {
    console.log('2 :)');
  }
}
