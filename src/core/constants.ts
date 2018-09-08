class Constants {
    public static readonly CANVAS_WIDTH = 800;
    public static readonly CANVAS_HEIGHT = 518;
    
    public static readonly X_IMPULSE = 0.275;
    public static readonly Y_IMPULSE = 0.175;
    
    public static readonly GRAVITY = 0.08;  // constant value added to vy every frame
    public static readonly DRAG = 0.955;    // constant value by which vx is multiplied every frame
    
    public static readonly MAX_X_SPEED = 2;
    public static readonly MAX_Y_SPEED = 2;
    
    public static readonly WINCH_SPEED = 1;
    public static readonly WINCH_LENGTH = 50;
    
    public static readonly GROUND_HEIGHT = 500;
    public static readonly LEVEL_TIME = 60;

    public static readonly OUTCOME_SPRITE_WIDTH = 30;
    public static readonly LIST_OUTCOME_DELAY = 20;

    public static readonly WINCH_Y_OFFSET = 12;

    public static readonly PERSON_HEIGHT = 18;

    public static readonly COLORS = {
        DRAW_COLOR: '#ffffff',
        SCANLINE_COLOR: '#006000',
        NONE: '#000000',
        SCANLINE_ALPHA: 0.25,
    };
    
    public static readonly INPUT = {
        None:               -1,
        Keys: {
            A:              65,
            B:              66,
            C:              67,
            D:              68,
            E:              69,
            F:              70,
            G:              71,
            H:              72,
            I:              73,
            J:              74,
            K:              75,
            L:              76,
            M:              77,
            N:              78,
            O:              79,
            P:              80,
            Q:              81,
            R:              82,
            S:              83,
            T:              84,
            U:              85,
            V:              86,
            W:              87,
            X:              88,
            Y:              89,
            Z:              90,
            Tab:            9,
            Alt:            18,
            Numpad0:        96,
            Numpad1:        97,
            Numpad2:        98,
            Numpad3:        99,
            Numpad4:        100,
            Numpad5:        101,
            Numpad6:        102,
            Numpad7:        103,
            Numpad8:        104,
            Numpad9:        105,
            NumpadMultiply: 106,
            NumpadAdd:      107,
            Numrow0:        48,
            Numrow1:        49,
            Numrow2:        50,
            Numrow3:        51,
            Numrow4:        52,
            Numrow5:        53,
            Numrow6:        54,
            Numrow7:        55,
            Numrow8:        56,
            Numrow9:        57,
            Escape:         27,
            Space:          32,
            DownArrow:      40,
            UpArrow:        38,
            LeftArrow:      37,
            RightArrow:     39,
        },
        Mouse: {
            Left:           1000,
            Right:          1001,
        }
    };
}
