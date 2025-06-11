import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { AboutInfoDTO } from "../Interface/aboutInfoDTO";
import { ApiResponse } from "../Share/interface/resultDTO";
import { CourseDto } from "../Interface/courseDTO";
import { HashTagListDto } from "../Interface/hashTagListDTO";
import { CourseWithTagDto } from "../Interface/coursewithtagDTO";

@Injectable({ providedIn: 'root' })
export class DescriptionService {

  constructor(private http: HttpClient,) {}

  private baseUrl = 'https://localhost:7274/api/Home';

  getAboutInfo(): Observable<AboutInfoDTO>{
    return this.http
    .get<ApiResponse<AboutInfoDTO>>(`${this.baseUrl}/aboutinfo`)
    .pipe(
      map(res =>{
        if(!res.success) throw new Error(res.message);
        if(res.data == null) throw new Error("回傳資料為空")
        return res.data;
      })
    )
  }

  getRandomCourses(): Observable<CourseWithTagDto[]>{
    return this.http
    .get<ApiResponse<CourseWithTagDto[]>>(`${this.baseUrl}/randomcourse`)
    .pipe(
      map(res =>{
        if(!res.success) throw new Error(res.message);
        if(res.data == null) throw new Error("回傳資料為空")
        return res.data;
      })
    )
}

  getRandomTag(): Observable<HashTagListDto[]>{
    return this.http
    .get<ApiResponse<HashTagListDto[]>>(`${this.baseUrl}/randomtag`)
    .pipe(
      map(res =>{
        if(!res.success) throw new Error(res.message);
        if(res.data == null) throw new Error("回傳資料為空")
        return res.data;
      })
    )
}
}
