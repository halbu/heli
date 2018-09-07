class AudioManager {
    public static samples = Object;
    public static sampleIndex = 0;
    public static readonly SAMPLE_BUFFER_SIZE = 6;
    public static GLOBAL_VOLUME = 0.5;

    public static initialise(): void {
        for (let i = 0; i !== this.SAMPLE_BUFFER_SIZE; ++i) {
            this.samples[i] = new Audio();
        }
    }

    public static playMusic(vol: number): void {
        let myAudio = new Audio('./assets/sounds/' + 'music_file_here');
        myAudio.volume = vol * this.GLOBAL_VOLUME;
        myAudio.loop = true;
        myAudio.play();
    }
    
    // TODO: rewrite this to use a hashmap of samples?
    // Calling new Audio() on every new sound is bad
    public static playSound(str: string, vol: number): void {
        let sample = this.samples[this.sampleIndex];

        sample.pause();
        sample.currentTime = 0;
        sample = new Audio('./assets/sounds/' + str + '.wav');
        // sample.playbackRate = 1;
        sample.volume = vol * this.GLOBAL_VOLUME;
        sample.play();

        this.sampleIndex = (this.sampleIndex + 1) % this.SAMPLE_BUFFER_SIZE;
    }
}
