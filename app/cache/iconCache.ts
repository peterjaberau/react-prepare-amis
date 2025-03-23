import createCache from "@emotion/cache";
import { euiStylisPrefixer } from "@elastic/eui"

import { appendIconComponentCache } from "@elastic/eui/es/components/icon/icon";
import { icon as EuiIconSecurityApp } from "@elastic/eui/es/components/icon/assets/app_security";
import { icon as EuiIconApps } from "@elastic/eui/es/components/icon/assets/apps";
import { icon as EuiIconArrowDown } from "@elastic/eui/es/components/icon/assets/arrow_down";
import { icon as EuiIconArrowLeft } from "@elastic/eui/es/components/icon/assets/arrow_left";
import { icon as EuiIconArrowRight } from "@elastic/eui/es/components/icon/assets/arrow_right";
import { icon as EuiIconArrowUp } from "@elastic/eui/es/components/icon/assets/arrow_up";
import { icon as EuiIconArrowEnd } from "@elastic/eui/es/components/icon/assets/arrowEnd";
import { icon as EuiIconArrowStart } from "@elastic/eui/es/components/icon/assets/arrowStart";
import { icon as EuiIconBell } from "@elastic/eui/es/components/icon/assets/bell";
import { icon as EuiIconBoxesHorizontal } from "@elastic/eui/es/components/icon/assets/boxes_horizontal";
import { icon as EuiIconBoxesVertical } from "@elastic/eui/es/components/icon/assets/boxes_vertical";
import { icon as EuiIconCalendar } from "@elastic/eui/es/components/icon/assets/calendar";
import { icon as EuiIconCheck } from "@elastic/eui/es/components/icon/assets/check";
import { icon as EuiIconCheer } from "@elastic/eui/es/components/icon/assets/cheer";
import { icon as EuiIconClock } from "@elastic/eui/es/components/icon/assets/clock";
import { icon as EuiControlsHorizontal } from "@elastic/eui/es/components/icon/assets/controls_horizontal";
import { icon as EuiIconCopy } from "@elastic/eui/es/components/icon/assets/copy";
import { icon as EuiIconCopyClipboard } from "@elastic/eui/es/components/icon/assets/copy_clipboard";
import { icon as EuiIconCross } from "@elastic/eui/es/components/icon/assets/cross";
import { icon as EuiIconCut } from "@elastic/eui/es/components/icon/assets/cut";
import { icon as EuiIconDashboardApp } from "@elastic/eui/es/components/icon/assets/app_dashboard";
import { icon as EuiIconDevToolsApp } from "@elastic/eui/es/components/icon/assets/app_devtools";
import { icon as EuiIconDiscoverApp } from "@elastic/eui/es/components/icon/assets/app_discover";
import { icon as EuiIconDiscuss } from "@elastic/eui/es/components/icon/assets/discuss";
import { icon as EuiIconDocumentation } from "@elastic/eui/es/components/icon/assets/documentation";
import { icon as EuiIconDot } from "@elastic/eui/es/components/icon/assets/dot";
import { icon as EuiIconDownload } from "@elastic/eui/es/components/icon/assets/download";
import { icon as EuiIconEmail } from "@elastic/eui/es/components/icon/assets/email";
import { icon as EuiIconEmpty } from "@elastic/eui/es/components/icon/assets/empty";
import { icon as EuiIconExit } from "@elastic/eui/es/components/icon/assets/exit";
import { icon as EuiIconExpandMini } from "@elastic/eui/es/components/icon/assets/expandMini";
import { icon as EuiIconEyeClosed } from "@elastic/eui/es/components/icon/assets/eye_closed";
import { icon as EuiIconFullScreen } from "@elastic/eui/es/components/icon/assets/full_screen";
import { icon as EuiIconFullScreenExit } from "@elastic/eui/es/components/icon/assets/fullScreenExit";
import { icon as EuiIconFunction } from "@elastic/eui/es/components/icon/assets/function";
import { icon as EuiIconGear } from "@elastic/eui/es/components/icon/assets/gear";
import { icon as EuiIconGlobe } from "@elastic/eui/es/components/icon/assets/globe";
import { icon as EuiIconGrab } from "@elastic/eui/es/components/icon/assets/grab";
import { icon as EuiIconGraphApp } from "@elastic/eui/es/components/icon/assets/app_graph";
import { icon as EuiIconHelp } from "@elastic/eui/es/components/icon/assets/help";
import { icon as EuiIconHome } from "@elastic/eui/es/components/icon/assets/home";
import { icon as EuiIconImport } from "@elastic/eui/es/components/icon/assets/import";
import { icon as EuiIconInputOutput } from "@elastic/eui/es/components/icon/assets/inputOutput";
import { icon as EuiIconKeyboard } from "@elastic/eui/es/components/icon/assets/keyboard";
import { icon as EuiIconLink } from "@elastic/eui/es/components/icon/assets/link";
import { icon as EuiIconListAdd } from "@elastic/eui/es/components/icon/assets/list_add";
import { icon as EuiIconLogoElastic } from "@elastic/eui/es/components/icon/assets/logo_elastic.js";
import { icon as EuiIconMachineLearningApp } from "@elastic/eui/es/components/icon/assets/app_ml";
import { icon as EuiIconMinus } from "@elastic/eui/es/components/icon/assets/minus";
import { icon as EuiIconMinusInCircle } from "@elastic/eui/es/components/icon/assets/minus_in_circle";
import { icon as EuiIconNode } from "@elastic/eui/es/components/icon/assets/node";
import { icon as EuiIconOffline } from "@elastic/eui/es/components/icon/assets/offline";
import { icon as EuiIconPayment } from "@elastic/eui/es/components/icon/assets/payment";
import { icon as EuiIconPencil } from "@elastic/eui/es/components/icon/assets/pencil";
import { icon as EuiIconPlusInCircle } from "@elastic/eui/es/components/icon/assets/plus_in_circle";
import { icon as EuiIconPopout } from "@elastic/eui/es/components/icon/assets/popout";
import { icon as EuiIconQuestionInCircle } from "@elastic/eui/es/components/icon/assets/question_in_circle";
import { icon as EuiIconRefresh } from "@elastic/eui/es/components/icon/assets/refresh";
import { icon as EuiIconReturnKey } from "@elastic/eui/es/components/icon/assets/return_key";
import { icon as EuiIconSearch } from "@elastic/eui/es/components/icon/assets/search";
import { icon as EuiIconSecuritySignal } from "@elastic/eui/es/components/icon/assets/securitySignal";
import { icon as EuiIconSecuritySignalDetected } from "@elastic/eui/es/components/icon/assets/securitySignalDetected";
import { icon as EuiIconShare } from "@elastic/eui/es/components/icon/assets/share";
import { icon as EuiIconSortDown } from "@elastic/eui/es/components/icon/assets/sort_down";
import { icon as EuiIconSortUp } from "@elastic/eui/es/components/icon/assets/sort_up";
import { icon as EuiIconSortable } from "@elastic/eui/es/components/icon/assets/sortable";
import { icon as EuiIconSortLeft } from "@elastic/eui/es/components/icon/assets/sortLeft";
import { icon as EuiIconSortRight } from "@elastic/eui/es/components/icon/assets/sortRight";
import { icon as EuiIconStarEmpty } from "@elastic/eui/es/components/icon/assets/star_empty";
import { icon as EuiIconStarFilled } from "@elastic/eui/es/components/icon/assets/star_filled";
import { icon as EuiIconTableDensityCompact } from "@elastic/eui/es/components/icon/assets/table_density_compact";
import { icon as EuiIconTableDensityExpanded } from "@elastic/eui/es/components/icon/assets/table_density_expanded";
import { icon as EuiIconTableDensityNormal } from "@elastic/eui/es/components/icon/assets/table_density_normal";
import { icon as EuiIconTimelionApp } from "@elastic/eui/es/components/icon/assets/app_timelion";
import { icon as EuiIconTimeRefresh } from "@elastic/eui/es/components/icon/assets/timeRefresh";
import { icon as EuiIconTokenNumber } from "@elastic/eui/es/components/icon/assets/tokenNumber";
import { icon as EuiIconTokenString } from "@elastic/eui/es/components/icon/assets/tokenString";
import { icon as EuiIconTraining } from "@elastic/eui/es/components/icon/assets/training";
import { icon as EuiIconTrash } from "@elastic/eui/es/components/icon/assets/trash";
import { icon as EuiIconUser } from "@elastic/eui/es/components/icon/assets/user";
import { icon as EuiIconVisualizeApp } from "@elastic/eui/es/components/icon/assets/app_visualize";
import { icon as EuiIconWarning } from "@elastic/eui/es/components/icon/assets/warning";
import { icon as EuiIconEditorCodeBlock } from "@elastic/eui/es/components/icon/assets/editor_code_block";
import { icon as EuiLogoElasticSearch } from "@elastic/eui/es/components/icon/assets/logo_elasticsearch";
import { icon as EuiIconVisMapRegion } from "@elastic/eui/es/components/icon/assets/vis_map_region";
import { icon as EuiIconVisPie } from "@elastic/eui/es/components/icon/assets/vis_pie";
import { icon as EuiIconVisMetric } from "@elastic/eui/es/components/icon/assets/vis_metric";
import { icon as EuiIconMenuLeft } from "@elastic/eui/es/components/icon/assets/menuLeft";
import { icon as EuiIconMenuRight } from "@elastic/eui/es/components/icon/assets/menuRight";
import { icon as EuiIconMenu } from "@elastic/eui/es/components/icon/assets/menu";
import { icon as EuiIconLogoCloud } from "@elastic/eui/es/components/icon/assets/logo_cloud";
import { icon as EuiIconLogoKibana } from "@elastic/eui/es/components/icon/assets/logo_kibana";
import { icon as EuiIconPlusInCircleFilled } from "@elastic/eui/es/components/icon/assets/plus_in_circle_filled";
import { icon as EuiIconPinFilled } from "@elastic/eui/es/components/icon/assets/pin_filled";
import { icon as EuiIconLogoAzureMono } from "@elastic/eui/es/components/icon/assets/logo_azure_mono";
import { icon as EuiIconLogoAWSMono } from "@elastic/eui/es/components/icon/assets/logo_aws_mono";
import { icon as EuiIconLogoGCPMono } from "@elastic/eui/es/components/icon/assets/logo_gcp_mono";
import { icon as EuiIconLogoSecurity } from "@elastic/eui/es/components/icon/assets/logo_security";
import { icon as EuiIconLockOpen } from "@elastic/eui/es/components/icon/assets/lockOpen";
import { icon as EuiIconLock } from "@elastic/eui/es/components/icon/assets/lock";
import { icon as EuiIconDesktop } from "@elastic/eui/es/components/icon/assets/desktop";
import { icon as EuiIconEye } from "@elastic/eui/es/components/icon/assets/eye";
import { icon as EuiIconPlugs } from "@elastic/eui/es/components/icon/assets/plugs";
import { icon as EuiIconLogoLogging } from "@elastic/eui/es/components/icon/assets/logo_logging";
import { icon as EuiIconLogoBeats } from "@elastic/eui/es/components/icon/assets/logo_beats";
import { icon as EuiIconPlus } from "@elastic/eui/es/components/icon/assets/plus";
import { icon as EuiIconBug } from "@elastic/eui/es/components/icon/assets/bug";
import { icon as EuiIconSection } from "@elastic/eui/es/components/icon/assets/section";
import { icon as EuiIconSave } from "@elastic/eui/es/components/icon/assets/save";

appendIconComponentCache({
    save: EuiIconSave,
    section: EuiIconSection,
    bug: EuiIconBug,
    plus: EuiIconPlus,
    logoBeats: EuiIconLogoBeats,
    logoLogging: EuiIconLogoLogging,
    plugs: EuiIconPlugs,
    eye: EuiIconEye,
    desktop: EuiIconDesktop,
    lock: EuiIconLock,
    lockOpen: EuiIconLockOpen,
    logoAzureMono: EuiIconLogoAzureMono,
    logoAWSMono: EuiIconLogoAWSMono,
    logoGCPMono: EuiIconLogoGCPMono,
    logoSecurity: EuiIconLogoSecurity,
    pinFilled: EuiIconPinFilled,
    plusInCircleFilled: EuiIconPlusInCircleFilled,
    logoKibana: EuiIconLogoKibana,
    logoCloud: EuiIconLogoCloud,
    menu: EuiIconMenu,
    menuRight: EuiIconMenuRight,
    menuLeft: EuiIconMenuLeft,
    visMapRegion: EuiIconVisMapRegion,
    visPie: EuiIconVisPie,
    visMetric: EuiIconVisMetric,
    logoElasticsearch: EuiLogoElasticSearch,
    editorCodeBlock: EuiIconEditorCodeBlock,
    logoElastic: EuiIconLogoElastic,
    apps: EuiIconApps,
    arrowDown: EuiIconArrowDown,
    arrowLeft: EuiIconArrowLeft,
    arrowRight: EuiIconArrowRight,
    arrowUp: EuiIconArrowUp,
    arrowStart: EuiIconArrowStart,
    arrowEnd: EuiIconArrowEnd,
    bell: EuiIconBell,
    boxesHorizontal: EuiIconBoxesHorizontal,
    boxesVertical: EuiIconBoxesVertical,
    calendar: EuiIconCalendar,
    check: EuiIconCheck,
    cheer: EuiIconCheer,
    clock: EuiIconClock,
    controlsHorizontal: EuiControlsHorizontal,
    copy: EuiIconCopy,
    copyClipboard: EuiIconCopyClipboard,
    cross: EuiIconCross,
    cut: EuiIconCut,
    discuss: EuiIconDiscuss,
    documentation: EuiIconDocumentation,
    dot: EuiIconDot,
    download: EuiIconDownload,
    empty: EuiIconEmpty,
    email: EuiIconEmail,
    exit: EuiIconExit,
    eyeClosed: EuiIconEyeClosed,
    expandMini: EuiIconExpandMini,
    fullScreen: EuiIconFullScreen,
    fullScreenExit: EuiIconFullScreenExit,
    function: EuiIconFunction,
    gear: EuiIconGear,
    globe: EuiIconGlobe,
    grab: EuiIconGrab,
    help: EuiIconHelp,
    home: EuiIconHome,
    importAction: EuiIconImport,
    inputOutput: EuiIconInputOutput,
    keyboard: EuiIconKeyboard,
    link: EuiIconLink,
    listAdd: EuiIconListAdd,
    minus: EuiIconMinus,
    minusInCircle: EuiIconMinusInCircle,
    node: EuiIconNode,
    offline: EuiIconOffline,
    payment: EuiIconPayment,
    pencil: EuiIconPencil,
    plusInCircle: EuiIconPlusInCircle,
    popout: EuiIconPopout,
    questionInCircle: EuiIconQuestionInCircle,
    refresh: EuiIconRefresh,
    returnKey: EuiIconReturnKey,
    search: EuiIconSearch,
    securityApp: EuiIconSecurityApp,
    securitySignal: EuiIconSecuritySignal,
    securitySignalDetected: EuiIconSecuritySignalDetected,
    share: EuiIconShare,
    sortable: EuiIconSortable,
    sortUp: EuiIconSortUp,
    sortDown: EuiIconSortDown,
    sortRight: EuiIconSortRight,
    sortLeft: EuiIconSortLeft,
    starEmpty: EuiIconStarEmpty,
    starFilled: EuiIconStarFilled,
    tableDensityCompact: EuiIconTableDensityCompact,
    tableDensityExpanded: EuiIconTableDensityExpanded,
    tableDensityNormal: EuiIconTableDensityNormal,
    timeRefresh: EuiIconTimeRefresh,
    tokenNumber: EuiIconTokenNumber,
    tokenString: EuiIconTokenString,
    training: EuiIconTraining,
    trash: EuiIconTrash,
    user: EuiIconUser,
    warning: EuiIconWarning,
    discoverApp: EuiIconDiscoverApp,
    dashboardApp: EuiIconDashboardApp,
    devToolsApp: EuiIconDevToolsApp,
    machineLearningApp: EuiIconMachineLearningApp,
    graphApp: EuiIconGraphApp,
    visualizeApp: EuiIconVisualizeApp,
    timelionApp: EuiIconTimelionApp,
});

const cache = createCache({
    key: "codesandbox",
    stylisPlugins: [euiStylisPrefixer],
    // @ts-ignore
    container: document.querySelector('meta[name="emotion-styles"]'),
});
cache.compat = true;

export default cache;
