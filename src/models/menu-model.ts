class MenuModel implements IModel {

    // tslint:disable-next-line:no-any
    public hiScoreMostHeroic: any;
    // tslint:disable-next-line:no-any
    public hiScoreMostMurderous: any;
    // tslint:disable-next-line:no-any
    public hiScoreBestOverall: any;

    constructor() {
        if (!PersistenceManager.retrieve('hiScoreMostHeroic')) {
            PersistenceManager.store('hiScoreMostHeroic', JSON.stringify({saves: 0, kills: 0}));
        }
        if (!PersistenceManager.retrieve('hiScoreMostMurderous')) {
            PersistenceManager.store('hiScoreMostMurderous', JSON.stringify({saves: 0, kills: 0}));
        }
        if (!PersistenceManager.retrieve('hiScoreBestOverall')) {
            PersistenceManager.store('hiScoreBestOverall', JSON.stringify({saves: 0, kills: 0}));
        }
        this.hiScoreMostHeroic = JSON.parse(PersistenceManager.retrieve('hiScoreMostHeroic'));
        this.hiScoreMostMurderous = JSON.parse(PersistenceManager.retrieve('hiScoreMostMurderous'));
        this.hiScoreBestOverall = JSON.parse(PersistenceManager.retrieve('hiScoreBestOverall'));
    }

    public act(): void {}
}
