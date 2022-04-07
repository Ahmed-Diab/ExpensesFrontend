import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { PhotoService } from '../general/photo.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { PublicService } from '../general/public.service';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
import { GestureController, ModalController, NavParams } from '@ionic/angular';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.page.html',
  styleUrls: ['./expense-form.page.scss'],
})
export class ExpenseFormPage implements AfterViewInit {

  //#region Declrations
  duration = 0;
  rec: string = '';
  categories: any[];
  recording: boolean = false;
  storedFileNames: any[] = [];
  durationDisplay: string = "";
  expenseImageURL: string = "";
  subscriptions: Subscription = new Subscription();
  expense: any = {
    id: 0,
    amount: 0,
    textNote: "",
    categoryId: 0,
    voiceNote: "",
    imageNote: "",
    voiceNoteFormat: "",
    imageNoteFormat: "",
    createdAt: new Date()
  };
  @ViewChild("recordbtn", { read: ElementRef }) recordbtn: ElementRef;
  //#endregion

  //#region Constrator
  constructor(
    private gestureController: GestureController,
    public publicService: PublicService,
    private photoService: PhotoService,
    public sanitizer: DomSanitizer,
    private modalController: ModalController,
    private navParam: NavParams,
    public datepipe: DatePipe
  ) {

  }
  //#endregion 

  //#region ionic life cycle
  ionViewDidLeave() {
    this.subscriptions.unsubscribe();
  }

  ionViewDidEnter() {
    this.subscriptions = new Subscription();
    //this.loadFiles();
    //VoiceRecorder.requestAudioRecordingPermission();
    let categories = this.navParam.get("categories");
    let expense = this.navParam.get("expense")
    if (categories) {
      this.categories = categories;
    }
    if (expense) {
      this.expense = expense;
      this.expense.categoryId = expense.categoryId
    } else {
      this.expense.categoryId = this.categories[0]?.id;
    }
  }
  //#endregion

  //#region angular life cycle
  ngAfterViewInit(): void {
    //   const longpress = this.gestureController.create({
    //     el: this.recordbtn.nativeElement,
    //     threshold: 0,
    //     gestureName: 'long-press',
    //     onStart: ev => {
    //       Haptics.impact({ style: ImpactStyle.Light })
    //       this.startRecording();
    //       this.calculateDuration();
    //     },
    //     onEnd: ev => {
    //       Haptics.impact({ style: ImpactStyle.Light });
    //       this.stopRecording();
    //     }
    //   }, true)
    //   longpress.enable();
  }
  //#endregion

  //#region Methods
  removeImage() {
    this.expense.imageNote = "";
    this.expense.imageNoteFormat = "";
  }

  startRecording() {
    if (this.recording) {
      return;
    }
    this.recording = true;
    VoiceRecorder.startRecording();
  }


  addPhotoToGallery() {
    this.photoService.addNewToGallery().then(data => {
      this.expense.imageNote = data.base64String;
      this.expense.imageNoteFormat = data.format;
    });
  }

  SaveExpense() {
    this.expense.id == 0 ? this.addNewExpense() : this.updateExpense();
  }

  async addNewExpense() {
    await this.publicService.loading()

    let data = {
      categoryId: this.expense.categoryId,
      amount: this.expense.amount,
      voiceNote: this.rec,
      imageNote: this.expense.imageNote,
      textNote: this.expense.textNote,
      imageNoteFormat: this.expense.imageNoteFormat,
      voiceNoteFormat: "",
      createdAt: new Date()
    }
    this.subscriptions.add(this.publicService.postMethod(`Expenses`, data).subscribe(async (response: any) => {
      await this.publicService.killLoading();
      if (response.success) {
        this.modalController.dismiss(response.data);
        this.publicService.showSussessToast(response.message)
      } else {
        this.publicService.showErrorAlert("Error", response.message)
      }
    }, async (error: HttpErrorResponse) => {
      await this.publicService.killLoading();
      this.publicService.showErrorAlert("Error", error.message)
    }))
  }

  async updateExpense() {
    let data = {
      categoryId: this.expense.categoryId,
      amount: this.expense.amount,
      voiceNote: this.rec,
      imageNote: this.expense.imageNote,
      textNote: this.expense.textNote,
      imageNoteFormat: this.expense.imageNoteFormat,
      voiceNoteFormat: ""
    }
    await this.publicService.loading();
    this.subscriptions.add(this.publicService.updateMethod(`Expenses/${this.expense.id}`, data).subscribe(async (response: any) => {
      if (response.success) {
        this.modalController.dismiss(response.data);
        this.publicService.showSussessToast(response.message)
      } else {
        this.publicService.showErrorAlert("Error", response.message)
      }
      await this.publicService.killLoading();
    }, async (error: HttpErrorResponse) => {
      await this.publicService.killLoading();
      this.publicService.showErrorAlert("Error", error.message)
    }))
  }

  onChange(file: any) {
    for (var i = 0; i < file.length; i++) {
      var fi = file[i];
      var imageReader = new FileReader();
      imageReader.onload = (event: any) => {
        this.expenseImageURL = event.target.result;
      }
      imageReader.readAsDataURL(fi);
    }
  }

  changeCategory(event: any) {
    this.expense.categoryId = event;
  }

  // async loadFiles() {
  //   Filesystem.readdir({
  //     path: "",
  //     directory: Directory.Data
  //   }).then(result => {
  //     this.storedFileNames = result.files;
  //   })
  // }

  // stopRecording() {
  //   if (!this.recording) {
  //     return;
  //   }
  //   VoiceRecorder.stopRecording().then(async (result: RecordingData) => {
  //     this.recording = false;
  //     if (result.value && result.value.recordDataBase64) {
  //       const recordData = result.value.recordDataBase64;
  //       const fileName = new Date().getTime() + '.mp3';
  //       await Filesystem.writeFile({
  //         path: fileName,
  //         directory: Directory.Data,
  //         data: recordData
  //       });
  //       this.loadFiles();
  //     }
  //   });
  // }


  // async playFile(fileName) {
  //   const audioFile = await Filesystem.readFile({
  //     path: fileName,
  //     directory: Directory.Data
  //   });
  //   const base64Sound = audioFile.data;
  //   const audioRef = new Audio(`data:audio/aac; base64, ${base64Sound}`);
  //   audioRef.oncanplaythrough = () => audioRef.play();
  //   audioRef.load();
  // }

  // async deleteRecording(fileName) {
  //   await Filesystem.deleteFile({
  //     directory: Directory.Data,
  //     path: fileName
  //   });
  //   this.storedFileNames = [];
  //   this.loadFiles();
  // }
  // calculateDuration() {
  //   if (!this.recording) {
  //     this.duration = 0;
  //     this.durationDisplay = "";
  //     return;
  //   }
  //   this.duration += 1;
  //   const minutes = Math.floor(this.duration / 60);
  //   const seconds = (this.duration % 60).toString().padStart(2, '0');
  //   this.durationDisplay = `${minutes}:${seconds}`
  //   setTimeout(() => {
  //     this.calculateDuration();
  //   }, 1000);
  // }
  //  async stopFile(fileName) {
  //     const audioFile = await Filesystem.readFile({
  //       path: fileName,
  //       directory: Directory.Data
  //     });
  //     const base64Sound = audioFile.data;
  //     const audioRef = new Audio(`data:audio/aac; base64, ${base64Sound}`);
  //     audioRef.oncanplaythrough = () => audioRef.pause();
  //     audioRef.load();
  //    }
  //#endregion
}