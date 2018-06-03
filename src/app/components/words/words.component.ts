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
  newWord: Word = {
    word: '',
    level: '',
    lesson: '',
    video: '',
    picture: ''
  };

  // ************************************ Table Elements ************************************
  displayedColumns = [
    'Palabra',
    'Nivel',
    'Leccion',
    'Media',
    'Editar',
    'Eliminar'
  ];
  dataSource = new MatTableDataSource();

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
  maxPictureSize = 300000;
  ErrSizePicture = 'El tamaño del archivo tiene que ser menor a 300KB';
  MsjPalabra = 'Nueva palabra';
  MsjPalabraDescrip = 'Nuevo concepto en el diccionario';

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
        if (event.target.files[0].size <= this.maxPictureSize) {
          this.mediaWord.pictureFile = <File>event.target.files[0];
          this.mediaWord.pictureName = event.target.files[0].name;
        } else {
          this.openSnackBar(this.ErrFileType, this.ErrSizePicture);
        }
      } else {
        this.openSnackBar(this.ErrFileType, this.ErrDescripPicture);
      }
    } else {
      this.mediaWord.pictureFile = null;
      this.mediaWord.pictureName = '';
    }
  }

  closeVideo() {
    this.mediaWord.videoFile = null;
    this.mediaWord.videoName = '';
  }

  closePicture() {
    this.mediaWord.pictureFile = null;
    this.mediaWord.pictureName = '';
  }

  validar(word) {
    // Validar campos completos
    const goodWord = word.word !== '' && word.word !== null;
    const goodLevel = word.level !== '' && word.level !== null;
    const goodLesson = word.lesson !== '' && word.lesson !== null;
    const goodVideo =
      this.mediaWord.videoName !== '' && this.mediaWord.videoFile !== null;
    const goodPicture =
      this.mediaWord.pictureName !== '' && this.mediaWord.pictureFile !== null;

    return goodWord && goodLevel && goodLesson && goodVideo && goodPicture;
  }

  addNewWord(word) {
    // Video e imagen para agregar
    const newVideo: FormData = new FormData();
    const newPicture: FormData = new FormData();

    // Cambiar nombre de video e imagen
    this.mediaWord.videoName = `${word.word}.mp4`;
    this.mediaWord.pictureName = `${word.word}.jpg`;
    const espacios = /\ /gi;
    const nuevoValor = '+';
    this.mediaWord.videoName = this.mediaWord.videoName.replace(
      espacios,
      nuevoValor
    );
    this.mediaWord.pictureName = this.mediaWord.pictureName.replace(
      espacios,
      nuevoValor
    );

    // Empacar video e imagen
    newVideo.append(
      'videoFile',
      this.mediaWord.videoFile,
      this.mediaWord.videoName.toLowerCase()
    );
    newPicture.append(
      'pictureFile',
      this.mediaWord.pictureFile,
      this.mediaWord.pictureName.toLowerCase()
    );
    // agregar video e imagen para recibir URL (POST)
    // ************************************ Agregar Video ************************************
    this.proxyService.addVideo(newVideo).subscribe(
      result => {
        if (result.code !== 200) {
          this.urlVideo = result;
          // ************************************ Agregar Imagen ************************************
          this.proxyService.addPicture(newPicture).subscribe(
            result2 => {
              if (result2.code !== 200) {
                this.urlPicture = result2;

                // Agregar video e imagen
                word.video = this.urlVideo.url;
                word.picture = this.urlPicture.url;
                this.words.push(word);

                // Mensaje de exito
                this.openSnackBar( this.MsjPalabra, this.MsjPalabraDescrip );
                this.closeVideo();
                this.closePicture();
                this.newWord.word = '';
                // ************************************ Agregar Palabra ************************************
                this.proxyService.addWord(word).subscribe(
                  result3 => {
                    if (result3.code !== 200) {

                      /**Poner acciones despues de añadir palabra */

                    } else {
                    }
                  },
                  error => {
                    console.log(<any>error);
                  }
                );
              } else {
              }
            },
            error => {
              console.log(<any>error);
            }
          );
        } else {
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  eliminarPalabra(word) {
    console.log(word);

    const response = confirm('¿Estás seguro de eliminar la palabra?');
    if (response) {
      const words = this.words;
      this.proxyService.deleteWord(word).subscribe(
        res => {
          console.log(res);
        },
        (event: any) => {
          console.log(event.status);
        }
      );
      for (let i = 0; i < this.words.length; i++) {
        if (words[i].word === word) {
          words.splice(i, 1);
          this.dataSource.data.splice(word);
        }
      }
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000
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
        videoURL: word.video,
        pictureURL: word.picture
      }
    });
    // tslint:disable-next-line:prefer-const
    let wordUpdate: Word;
    dialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined') {
        word.word = result.palabra;
        word.level = result.nivel;
        word.lesson = result.leccion;
        word.video = result.videoURL;
        word.picture = result.pictureURL;
        this.proxyService.updateWord(word).subscribe(
          data => {
            if (data.code !== 200) {
              // this.dataSource.data = data;
            } else {
            }
          },
          error => {
            console.log(<any>error);
          }
        );
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
  maxPictureSize = 300000;
  ErrSizePicture = 'El tamaño del archivo tiene que ser menor a 300KB';

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
        if (event.target.files[0].size <= this.maxPictureSize) {
          this.mediaWord.pictureFile = <File>event.target.files[0];
          this.mediaWord.pictureName = event.target.files[0].name;
        } else {
          this.openSnackBar(this.ErrFileType, this.ErrSizePicture);
        }
      } else {
        this.openSnackBar(this.ErrFileType, this.ErrDescripPicture);
      }
    } else {
      this.mediaWord.pictureFile = null;
      this.mediaWord.pictureName = '';
    }
  }

  closeVideo() {
    this.mediaWord.videoFile = null;
    this.mediaWord.videoName = '';
  }

  closePicture() {
    this.mediaWord.pictureFile = null;
    this.mediaWord.pictureName = '';
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
    this.mediaWord.videoName = this.mediaWord.videoName.replace(
      espacios,
      nuevoValor
    );
    this.mediaWord.pictureName = this.mediaWord.pictureName.replace(
      espacios,
      nuevoValor
    );

    // Empacar video e imagen
    newVideo.append(
      'videoFile',
      this.mediaWord.videoFile,
      this.mediaWord.videoName.toLowerCase()
    );
    newPicture.append(
      'pictureFile',
      this.mediaWord.pictureFile,
      this.mediaWord.pictureName.toLowerCase()
    );
    // agregar video e imagen para recibir URL (POST)
    // ************************************ Agregar Video ************************************
    this.proxyService.addVideo(newVideo).subscribe(
      result => {
        if (result.code !== 200) {
          this.urlVideo = result;
        } else {
        }
      },
      error => {
        console.log(<any>error);
      }
    );
    // ************************************ Agregar Imagen ************************************
    this.proxyService.addPicture(newPicture).subscribe(
      result => {
        if (result.code !== 200) {
          this.urlPicture = result;
        } else {
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }
}
