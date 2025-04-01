
import { t } from 'i18next';
import WelcomeScreenSrc from '../../assets/img/welcome-screen.png';
import MonogramSrc, {
  ReactComponent as Monogram,
} from '../../assets/svg/logo-monogram.svg';
import LogoSrc, { ReactComponent as Logo } from '../../assets/svg/logo.svg';

class BrandClassBase {
  public getMonogram() {
    return { src: MonogramSrc, svg: Monogram };
  }

  public getLogo() {
    return { src: LogoSrc, svg: Logo };
  }

  public getPageTitle() {
    return t('label.open-metadata');
  }

  public getWelcomeScreenImg() {
    return WelcomeScreenSrc;
  }
}

const brandClassBase = new BrandClassBase();

export default brandClassBase;
export { BrandClassBase };
