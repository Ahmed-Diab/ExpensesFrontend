import { Component, OnInit } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { ModalController } from '@ionic/angular';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.page.html',
  styleUrls: ['./expense-form.page.scss'],
})
export class ExpenseFormPage implements OnInit {
  recording: boolean = false;
  storedFileNames: any[] = [];
  constructor(
   ) {
     
  }

  ngOnInit() {
    this.loadFiles();
    VoiceRecorder.requestAudioRecordingPermission();
  }

  async loadFiles() {
    Filesystem.readdir({
      path: "",
      directory: Directory.Data
    }).then(result => {
      console.log(result);
      this.storedFileNames = result.files;

    })
  }


  startRecording() {
    if (this.recording) {
      return;
    }
    VoiceRecorder.startRecording();
  }

  stopRecording() {
    if (!this.recording) {
      return;
    }
    VoiceRecorder.stopRecording().then(async (result: RecordingData) => {
      if (result.value && result.value.recordDataBase64) {
        const recordData = result.value.recordDataBase64;
        const fileName = new Date().getTime() + '.mp3';
        await Filesystem.writeFile({
          path: fileName,
          directory: Directory.Data,
          data: recordData
        });
        this.loadFiles();
      }
    });

  }
}