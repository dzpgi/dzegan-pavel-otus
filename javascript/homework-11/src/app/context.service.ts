import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

// Глобальный контекст приложения

export class ContextService {
  languages = []
  verificationTime: number = 10000
  verificationTextCount: number = 3
}