import { NodeMaterial } from "babylonjs/Materials/Node/nodeMaterial";
import { Nullable } from "babylonjs/types";
import { Observable } from 'babylonjs/Misc/observable';
import { LogEntry } from './components/log/logComponent';
import { NodeMaterialBlock } from 'babylonjs/Materials/Node/nodeMaterialBlock';
import { PreviewType } from './components/preview/previewType';
import { DataStorage } from 'babylonjs/Misc/dataStorage';
import { Color4 } from 'babylonjs/Maths/math.color';
import { GUINode } from './diagram/graphNode';
import { Vector2 } from 'babylonjs/Maths/math.vector';
import { FramePortData, WorkbenchComponent } from './diagram/workbench';
import { NodeMaterialModes } from 'babylonjs/Materials/Node/Enums/nodeMaterialModes';

export class GlobalState {
    nodeMaterial: NodeMaterial;
    guiTexture: BABYLON.GUI.AdvancedDynamicTexture;
    hostElement: HTMLElement;
    hostDocument: HTMLDocument;
    hostWindow: Window;
    onSelectionChangedObservable = new Observable<Nullable<GUINode | FramePortData>>();
    onRebuildRequiredObservable = new Observable<void>();
    onBuiltObservable = new Observable<void>();
    onResetRequiredObservable = new Observable<void>();
    onUpdateRequiredObservable = new Observable<void>();
    onZoomToFitRequiredObservable = new Observable<void>();
    onReOrganizedRequiredObservable = new Observable<void>();
    onLogRequiredObservable = new Observable<LogEntry>();
    onErrorMessageDialogRequiredObservable = new Observable<string>();
    onIsLoadingChanged = new Observable<boolean>();
    onPreviewCommandActivated = new Observable<boolean>();
    onLightUpdated = new Observable<void>();
    onPreviewBackgroundChanged = new Observable<void>();
    onBackFaceCullingChanged = new Observable<void>();
    onDepthPrePassChanged = new Observable<void>();
    onAnimationCommandActivated = new Observable<void>();
    onCandidateLinkMoved = new Observable<Nullable<Vector2>>();
    onSelectionBoxMoved = new Observable<ClientRect | DOMRect>();
    onImportFrameObservable = new Observable<any>();
    onGraphNodeRemovalObservable = new Observable<GUINode>();
    onGetNodeFromBlock: (block: NodeMaterialBlock) => GUINode;
    onGridSizeChanged = new Observable<void>();
    onExposePortOnFrameObservable = new Observable<GUINode>();
    previewType: PreviewType;
    previewFile: File;
    listOfCustomPreviewFiles: File[] = [];
    rotatePreview: boolean;
    backgroundColor: Color4;
    backFaceCulling: boolean;
    depthPrePass: boolean;
    blockKeyboardEvents = false;
    hemisphericLight: boolean;
    directionalLight0: boolean;
    directionalLight1: boolean;
    controlCamera: boolean;
    workbench: WorkbenchComponent;
    storeEditorData: (serializationObject: any, frame?: Nullable<null>) => void;
    _mode: NodeMaterialModes;

    /** Gets the mode */
    public get mode(): NodeMaterialModes {
        return this._mode;
    }

    /** Sets the mode */
    public set mode(m: NodeMaterialModes) {
        DataStorage.WriteNumber("Mode", m);
        this._mode = m;
        this.onPreviewCommandActivated.notifyObservers(true);
    }

    customSave?: {label: string, action: (data: string) => Promise<void>};

    public constructor() {
        this.previewType = DataStorage.ReadNumber("PreviewType", PreviewType.Box);
        this.backFaceCulling = DataStorage.ReadBoolean("BackFaceCulling", true);
        this.depthPrePass = DataStorage.ReadBoolean("DepthPrePass", false);
        this.hemisphericLight = DataStorage.ReadBoolean("HemisphericLight", true);
        this.directionalLight0 = DataStorage.ReadBoolean("DirectionalLight0", false);
        this.directionalLight1 = DataStorage.ReadBoolean("DirectionalLight1", false);
        this.controlCamera = DataStorage.ReadBoolean("ControlCamera", true);
        this._mode = DataStorage.ReadNumber("Mode", NodeMaterialModes.Material);

        let r = DataStorage.ReadNumber("BackgroundColorR", 0.12549019607843137);
        let g = DataStorage.ReadNumber("BackgroundColorG", 0.09803921568627451);
        let b = DataStorage.ReadNumber("BackgroundColorB", 0.25098039215686274);
        this.backgroundColor = new Color4(r, g, b, 1.0);
    }
}