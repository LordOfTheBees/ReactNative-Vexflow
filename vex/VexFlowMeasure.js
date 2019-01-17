import { vexConverter } from '../main/MusicVisitor'
import { Voice } from 'vexflow/src/voice'

export default class VexFlowMeasure {
    constructor(xmlMeasure) {
        this.xmlMeasure = xmlMeasure
        this.voiceList = []
        this.staveList = xmlMeasure.accept(vexConverter)
        this.page = -1
        this.staveList.forEach((stave, idx) => {
            this.voiceList.push([])
            xmlMeasure.voices.forEach(voice => {
                const voiceNotes = xmlMeasure.notes.filter(n => n.staff === (idx+1) && n.voice === voice && !n.isInChord)
                if (voiceNotes.length > 0) {
                    const vexFlowNotes = []
                    voiceNotes.forEach(note => {
                        const vfnote = note.accept(vexConverter)
                        vexFlowNotes.push(vfnote)
                    })
                    const vexFlowVoice = new Voice(xmlMeasure.attributes.time.toString())
                                                .addTickables(vexFlowNotes)
                    this.voiceList[idx].push(vexFlowVoice)
                }
            })
            // const voice = new VexFlowVoice(xmlMeasure, idx)
            // this.voiceContainers.push(voice)
        })
    }

    getClefByStaff(index) {
        return this.xmlMeasure.getClefByStaff(index)
    }

    get part() {
        return this.xmlMeasure.part
    }

    get number() {
        return this.xmlMeasure.number
    }

    get staves() {
        return this.xmlMeasure.staves
    }

    get time() {
        return this.xmlMeasure.attributes.time
    }

    get clefs() {
        return this.xmlMeasure.clefs
    }

    get key() {
        return this.xmlMeasure.attributes.key
    }


    joinVoices(formatter) {
        // for (let idx = 0; idx < this.staveList.length; ++idx)
        //     this.voiceContainers[idx].joinVoices(formatter, this.staveList[idx])
        for (let idx = 0; idx < this.staveList.length; ++idx) {
            formatter.joinVoices(this.voiceList[idx], { align_rests: false })
                .formatToStave(this.voiceList[idx], this.staveList[idx],
                     { align_rests:false, stave: this.staveList[idx] })
        }
    }

    draw(context) {
        this.staveList.forEach((stave, idx) => { 
            stave.setContext(context)
            stave.draw()
            this.voiceList[idx].forEach((voice) => voice.draw(context))
        })
    }

}