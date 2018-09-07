interface IAppScreen {
    ctx: CanvasRenderingContext2D;
    model: IModel;
    view: IView;
    controller: IController;
    heli: HELI;

    act(): void;
}
