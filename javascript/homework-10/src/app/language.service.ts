import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {

    constructor() { }
    languages: Record<string, string>[] = [
        { code: 'rus', name: 'Русский'},
        { code: 'eng', name: 'English'}
    ]
    dictionary: Record<string, string>[] = [
        { rus: 'привет',  eng: 'hello'},
        { rus: 'мир',     eng: 'word'},
        { rus: 'кот',     eng: 'cat'},
        { rus: 'собака',  eng: 'dog'},
        { rus: 'попугай', eng: 'parrot'}
    ]

    applyNewText(sysLanguage: string, sysText: string, userLanguage: string, userText: string): Promise<any>{
        const service = this
        const request = new Promise(function(resolve, reject) {
            setTimeout(function(sysLanguage: string, sysText: string, userLanguage: string, userText: string, dictionary: Record<string, string>[]) {
                if (!sysLanguage || !sysText || !userLanguage || !userText) {
                    resolve(false)
                    return
                }
                let word: Record<string, string>|undefined = dictionary.find(function(record) {
                    return (record[sysLanguage] as string).toLocaleLowerCase().trim() === sysText.toLocaleLowerCase().trim()? true: false
                })
                if (word) {
                    (word as Record<string, string>)[userLanguage] = userText
                } else {
                    word = {}
                    word[sysLanguage] = sysText
                    word[userLanguage] = userText
                    dictionary.push(word)
                }
                resolve(true)
            }, 1000, sysLanguage, sysText, userLanguage, userText, service.dictionary)
        })
        return request
    }
    checkText(sysLanguage: string, sysText: string, userLanguage: string, userText: string): Promise<any> {
        const service = this
        const request = new Promise(function(resolve, reject) {
            setTimeout(function(sysLanguage: string, sysText: string, userLanguage: string, userText: string, dictionary: []) {
                const word: Record<string, string>|undefined = dictionary.find(function(record) {
                    return (record[sysLanguage] as string).toLocaleLowerCase().trim() === sysText.toLocaleLowerCase().trim()
                })
                const result = word && (word[userLanguage] as string).toLocaleLowerCase().trim() === userText.toLocaleLowerCase().trim()? true: false
                resolve(result)
            }, 1000, sysLanguage, sysText, userLanguage, userText, service.dictionary)
        })
        return request
    }
    getDictionary(): Promise<any> {
        const service = this
        const request = new Promise(function(resolve, reject) {
            setTimeout(function(dictionary: Record<string, string>[]) {
                resolve(dictionary)
            }, 1000, service.dictionary)
        })
        return request
    }
    getLanguages(): Promise<any> {
        const service = this
        const request = new Promise(function(resolve, reject) {
            setTimeout(function(languages: Record<string, string>[]) {
                resolve(languages)
            }, 1000, service.languages)
        })
        return request
    }
}
