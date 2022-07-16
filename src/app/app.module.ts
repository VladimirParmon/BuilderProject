import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/core/header/header.component';
import { ContentsComponent } from './components/core/contents/contents.component';
import { ViewComponent } from './components/core/view/view.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { Page404Component } from './pages/page404/page404.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { QuillModule } from 'ngx-quill';
import {
  APP_BASE_HREF,
  HashLocationStrategy,
  LocationStrategy,
} from '@angular/common';
import { TextComponent } from './components/tools/text/text.component';
import { ToolGeneratorComponent } from './components/tools/tool-generator/tool-generator.component';
import { ImageComponent } from './components/tools/image/image.component';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { PdfComponent } from './components/tools/pdf/pdf.component';
import { VideoComponent } from './components/tools/video/video.component';
import { AudioComponent } from './components/tools/audio/audio.component';
import { SliderComponent } from './components/tools/slider/slider.component';
import { FullscreenDirective } from './directives/fullscreen.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContentsComponent,
    ViewComponent,
    MainPageComponent,
    Page404Component,
    AboutPageComponent,
    TextComponent,
    ToolGeneratorComponent,
    ImageComponent,
    PdfComponent,
    VideoComponent,
    AudioComponent,
    SliderComponent,
    FullscreenDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    DragDropModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    QuillModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatRadioModule,
    MatSliderModule,
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
