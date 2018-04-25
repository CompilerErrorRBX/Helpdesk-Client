<template>
  <v-layout row justify-center align-center>
    <v-card class="upload-card" flat height="250px" width="100%">
      <img class="file-overlay" v-if="fileData" width="auto" height="100%" :src="fileData" />
      <div class="upload-overlay" v-if="uploading">
        <v-scale-transition>
          <v-progress-circular color="secondary" :value="progress" :width="7" size="72">
            <v-avatar v-if="progress > 1" class="primary" size="64">
              <transition name="bounce">
                <v-icon class="overlay" color="white" v-if="progress < 100">cloud_upload</v-icon>
              </transition>
              <transition name="bounce">
                <v-icon
                  class="overlay"
                  color="white"
                  v-if="progress == 100"
                >
                  {{ uploadIcon }}
                </v-icon>
              </transition>
            </v-avatar>
          </v-progress-circular>
        </v-scale-transition>
      </div>
      <form
        v-if="!fileData"
        method="POST"
        enctype="multipart/form-data"
        class="drop-form"
        :class="{ 'drag-over': dragOver }"
        @drop.stop.prevent
        @dragenter.stop="dragOver = true"
        @dragleave.stop="dragOver = false"
      >
        <input type="file" class="uploader" @drop.stop.prevent="fileUpload" @click.prevent />
        <v-icon class="upload-icon">cloud_upload</v-icon>
        <span class="title">Drag and drop an image here</span>
        <span class="subheader">or</span>
        <v-btn color="primary">
          Browse Files
          <input type="file" @change="fileUpload" class="uploader" />
        </v-btn>
      </form>
    </v-card>
  </v-layout>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FileUpload',
  data: () => ({
    valid: false,
    dragOver: false,
    fileData: null,
    uploading: false,
    uploadIcon: 'check',
    progress: 0,
  }),
  methods: {
    fileUpload(e) {
      this.dragOver = false;
      this.uploading = true;

      const files = e.dataTransfer || e.target;
      const file = files.files[0];
      const formData = new FormData();

      formData.append('upload', file);

      const reader = new FileReader();
      reader.onload = (evt) => {
        this.fileData = evt.target.result;
      };

      axios.post('/api/pictureUpload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            this.progress = Math.min(
              Math.round((progressEvent.loaded * 100) / progressEvent.total), 99);
          },
        },
      ).then(() => {
        setTimeout(() => {
          this.progress = 100;
        }, 200);
      }).catch(() => {
        this.uploadIcon = 'cloud_off';
      });

      reader.readAsDataURL(file);
    },
  },
};
</script>

<style lang="scss" scoped>
  .bounce-enter-active {
    animation: bounce-in .5s;
  }
  .bounce-leave-active {
    animation: bounce-in .5s reverse;
  }
  @keyframes bounce-in {
    0% {
      opacity: 0;
      transform: scale(0);
    }
    33% {
      transform: scale(1.3);
    }
    50% {
      opacity: 1;
    }
    66% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
    }
  }

  .upload-card.card.card--flat {
    display: flex;
    justify-content: center;
    align-items: center;
    .upload-icon {
      font-size: 80px;
    }

    .file-overlay {
      border: none;
      margin: auto;
    }

    .upload-overlay {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(255,255,255,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .drop-form {
      border: 3px dashed rgba(0,0,0,0.25);
      display: flex;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .file-drop, .uploader {
        width: 100%;
        height: 100%;
        opacity: 0;
        position: absolute;
      }

      &.drag-over {
        background-color: rgba(0,0,0,0.05);
      }
    }
  }
</style>
