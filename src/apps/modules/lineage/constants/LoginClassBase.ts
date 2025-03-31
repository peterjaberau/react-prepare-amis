

import collaborationImg from '../assets/img/login-screen/data-collaboration.png';
import discoveryImg from '../assets/img/login-screen/data-discovery.png';
import governanceImg from '../assets/img/login-screen/data-governance.png';
import insightImg from '../assets/img/login-screen/data-insights.png';
import dataQualityImg from '../assets/img/login-screen/data-quality.png';

class LoginClassBase {
  public carouselImages() {
    return {
      dataDiscovery: discoveryImg,
      dataQuality: dataQualityImg,
      governance: governanceImg,
      dataInsightPlural: insightImg,
      dataCollaboration: collaborationImg,
    };
  }
}

const loginClassBase = new LoginClassBase();

export default loginClassBase;
export { LoginClassBase };
