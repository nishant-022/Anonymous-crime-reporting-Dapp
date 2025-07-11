// Home.jsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { ethers } from 'ethers';
import { withRouter } from 'react-router-dom';
import abi from "./contractJson/Report.json";
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import ChatbotComponent from './chatbot';
import './home.css';

const CONTRACT_ADDRESS   = process.env.REACT_APP_CONTRACT_ADDRESS;
const ADMIN_ADDRESS      = process.env.REACT_APP_ADMIN_ADDRESS;
const SEPOLIA_CHAIN_ID   = '0xAA36A7'; 

const Home = (props) => {
  const [provider, setProvider] = useState(null);
  const [signer,   setSigner]   = useState(null);
  const [contract, setContract] = useState(null);
  const [account,  setAccount]  = useState("None");

  useEffect(() => {
    const initOnboard = async () => {
      if (!window.ethereum) {
        console.error("MetaMask not detected");
        return;
      }
      // 1️⃣ Switch or add Holesky network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SEPOLIA_CHAIN_ID }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId:           SEPOLIA_CHAIN_ID,
                chainName:         'Sepolia',
                rpcUrls:           ['https://sepolia.infura.io'],
                nativeCurrency:    { name: 'Ether', symbol: 'ETH', decimals: 18 },
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              }],
            });
          } catch (addError) {
            console.error("Failed to add Holesky network", addError);
            return;
          }
        } else {
          console.error("Failed to switch to Holesky", switchError);
          return;
        }
      }
      // 2️⃣ Set up provider, signer, account, contract
      const prov = new ethers.providers.Web3Provider(window.ethereum);
      await prov.send('eth_requestAccounts', []);
      const sign = prov.getSigner();
      const addr = await sign.getAddress();
      const crimeContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        abi.abi,
        sign
      );
      setProvider(prov);
      setSigner(sign);
      setAccount(addr.toLowerCase());
      setContract(crimeContract);
    };
    initOnboard();
  }, [account]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount('None');
        }
      });
    }
  }, []);

  // Navigate to dashboard (user)
  const loginWithMetaMask = () => {
    props.history.push('/dashboard');
  };

  // Navigate to admin panel only if connected account matches
  const loginAsAdmin = () => {
    if (account === ADMIN_ADDRESS?.toLowerCase()) {
      props.history.push('/admin-dash');
    } else {
      alert("You are not an admin");
    }
  };

  return (
    <div className="home-container">
      <Helmet>
        <title>CRIME AlERT</title>
        <meta property="og:title" content="CRIME ALERT" />
      </Helmet>
      <header data-thq="thq-navbar" className="home-navbar">
        <span className="home-logo">CRIME ALERT</span>

        <div className="home-container1">
          <div className="home-container2">
            <div className="home-container3">
              <div
                data-thq="thq-navbar-nav"
                data-role="Nav"
                className="home-desktop-menu"
              >
                <nav
                  data-thq="thq-navbar-nav-links"
                  data-role="Nav"
                  className="home-nav"
                ></nav>
              </div>
            </div>
          </div>
          <a
            href="https://www.linkedin.com/in/nishant-gupta-640891245/"
            target="_blank"
            rel="noreferrer noopener"
            className="home-link2"
          >
            <svg viewBox="0 0 877.7142857142857 1024" className="home-icon04">
              <path d="M199.429 357.143v566.286h-188.571v-566.286h188.571zM211.429 182.286c0.571 54.286-40.571 97.714-106.286 97.714v0h-1.143c-63.429 0-104-43.429-104-97.714 0-55.429 42.286-97.714 106.286-97.714 64.571 0 104.571 42.286 105.143 97.714zM877.714 598.857v324.571h-188v-302.857c0-76-27.429-128-95.429-128-52 0-82.857 34.857-96.571 68.571-4.571 12.571-6.286 29.143-6.286 46.286v316h-188c2.286-513.143 0-566.286 0-566.286h188v82.286h-1.143c24.571-38.857 69.143-95.429 170.857-95.429 124 0 216.571 81.143 216.571 254.857z"></path>
            </svg>
          </a>
        </div>
        <div data-thq="thq-navbar-btn-group" className="home-btn-group">
          <div className="home-socials"></div>
        </div>
        <div className="home-container4"></div>
        <div data-thq="thq-burger-menu" className="home-burger-menu">
          <button className="button home-button">
            <svg viewBox="0 0 1024 1024" className="home-icon06">
              <path d="M128 554.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 298.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 810.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667z"></path>
            </svg>
          </button>
          <div
            data-thq="slider"
            data-navigation="true"
            data-pagination="true"
            className="home-slider swiper"
          >
            <div data-thq="slider-wrapper" className="swiper-wrapper"></div>
            <div
              data-thq="slider-pagination"
              className="home-slider-pagination swiper-pagination swiper-pagination-bullets swiper-pagination-horizontal"
            ></div>
            <div
              data-thq="slider-button-prev"
              className="swiper-button-prev"
            ></div>
            <div
              data-thq="slider-button-next"
              className="swiper-button-next"
            ></div>
          </div>
        </div>
        <div data-thq="thq-mobile-menu" className="home-mobile-menu">
          <div
            data-thq="thq-mobile-menu-nav"
            data-role="Nav"
            className="home-nav1"
          >
            <div className="home-container5">
              <span className="home-logo1">Character</span>
              <div data-thq="thq-close-menu" className="home-menu-close">
                <svg viewBox="0 0 1024 1024" className="home-icon08">
                  <path d="M810 274l-238 238 238 238-60 60-238-238-238 238-60-60 238-238-238-238 60-60 238 238 238-238z"></path>
                </svg>
              </div>
            </div>
            <nav
              data-thq="thq-mobile-menu-nav-links"
              data-role="Nav"
              className="home-nav2"
            >
              <span className="home-text">About</span>
              <span className="home-text01">Features</span>
              <span className="home-text02">Pricing</span>
              <span className="home-text03">Team</span>
              <span className="home-text04">Blog</span>
            </nav>
            <div className="home-container6">
              <button className="home-login button">Login</button>
              <button className="button">Register</button>
            </div>
          </div>
          <div className="home-icon-group">
            <svg viewBox="0 0 950.8571428571428 1024" className="home-icon10">
              <path d="M925.714 233.143c-25.143 36.571-56.571 69.143-92.571 95.429 0.571 8 0.571 16 0.571 24 0 244-185.714 525.143-525.143 525.143-104.571 0-201.714-30.286-283.429-82.857 14.857 1.714 29.143 2.286 44.571 2.286 86.286 0 165.714-29.143 229.143-78.857-81.143-1.714-149.143-54.857-172.571-128 11.429 1.714 22.857 2.857 34.857 2.857 16.571 0 33.143-2.286 48.571-6.286-84.571-17.143-148-91.429-148-181.143v-2.286c24.571 13.714 53.143 22.286 83.429 23.429-49.714-33.143-82.286-89.714-82.286-153.714 0-34.286 9.143-65.714 25.143-93.143 90.857 112 227.429 185.143 380.571 193.143-2.857-13.714-4.571-28-4.571-42.286 0-101.714 82.286-184.571 184.571-184.571 53.143 0 101.143 22.286 134.857 58.286 41.714-8 81.714-23.429 117.143-44.571-13.714 42.857-42.857 78.857-81.143 101.714 37.143-4 73.143-14.286 106.286-28.571z"></path>
            </svg>
            <svg viewBox="0 0 877.7142857142857 1024" className="home-icon12">
              <path d="M585.143 512c0-80.571-65.714-146.286-146.286-146.286s-146.286 65.714-146.286 146.286 65.714 146.286 146.286 146.286 146.286-65.714 146.286-146.286zM664 512c0 124.571-100.571 225.143-225.143 225.143s-225.143-100.571-225.143-225.143 100.571-225.143 225.143-225.143 225.143 100.571 225.143 225.143zM725.714 277.714c0 29.143-23.429 52.571-52.571 52.571s-52.571-23.429-52.571-52.571 23.429-52.571 52.571-52.571 52.571 23.429 52.571 52.571zM438.857 152c-64 0-201.143-5.143-258.857 17.714-20 8-34.857 17.714-50.286 33.143s-25.143 30.286-33.143 50.286c-22.857 57.714-17.714 194.857-17.714 258.857s-5.143 201.143 17.714 258.857c8 20 17.714 34.857 33.143 50.286s30.286 25.143 50.286 33.143c57.714 22.857 194.857 17.714 258.857 17.714s201.143 5.143 258.857-17.714c20-8 34.857-17.714 50.286-33.143s25.143-30.286 33.143-50.286c22.857-57.714 17.714-194.857 17.714-258.857s5.143-201.143-17.714-258.857c-8-20-17.714-34.857-33.143-50.286s-30.286-25.143-50.286-33.143c-57.714-22.857-194.857-17.714-258.857-17.714zM877.714 512c0 60.571 0.571 120.571-2.857 181.143-3.429 70.286-19.429 132.571-70.857 184s-113.714 67.429-184 70.857c-60.571 3.429-120.571 2.857-181.143 2.857s-120.571 0.571-181.143-2.857c-70.286-3.429-132.571-19.429-184-70.857s-67.429-113.714-70.857-184c-3.429-60.571-2.857-120.571-2.857-181.143s-0.571-120.571 2.857-181.143c3.429-70.286 19.429-132.571 70.857-184s113.714-67.429 184-70.857c60.571-3.429 120.571-2.857 181.143-2.857s120.571-0.571 181.143 2.857c70.286 3.429 132.571 19.429 184 70.857s67.429 113.714 70.857 184c3.429 60.571 2.857 120.571 2.857 181.143z"></path>
            </svg>
            <svg viewBox="0 0 602.2582857142856 1024" className="home-icon14">
              <path d="M548 6.857v150.857h-89.714c-70.286 0-83.429 33.714-83.429 82.286v108h167.429l-22.286 169.143h-145.143v433.714h-174.857v-433.714h-145.714v-169.143h145.714v-124.571c0-144.571 88.571-223.429 217.714-223.429 61.714 0 114.857 4.571 130.286 6.857z"></path>
            </svg>
          </div>
        </div>
        <div data-thq="thq-dropdown" className="home-meta-mask list-item"></div>
        <div data-thq="thq-dropdown" className="home-admin list-item">
          <div data-thq="thq-dropdown-toggle" className="home-dropdown-toggle">
            <span className="home-text05">LOGIN</span>
            <div data-thq="thq-dropdown-arrow" className="home-dropdown-arrow">
              <svg viewBox="0 0 1024 1024" className="home-icon16">
                <path d="M426 726v-428l214 214z"></path>
              </svg>
            </div>
          </div>
          <ul data-thq="thq-dropdown-list" className="home-dropdown-list">
            <li data-thq="thq-dropdown" className="home-dropdown list-item">
              <div
                data-thq="thq-dropdown-toggle"
                className="home-dropdown-toggle1"
              >
                <span className="home-text06" onClick={loginWithMetaMask}>User</span>
              </div>
            </li>
            <li data-thq="thq-dropdown" className="home-dropdown1 list-item">
              <div
                data-thq="thq-dropdown-toggle"
                className="home-dropdown-toggle2"
              >
                <span className="home-text07" onClick={loginAsAdmin}>Admin</span>
                <div
                  data-thq="thq-dropdown-arrow"
                  className="home-dropdown-arrow1"
                ></div>
              </div>
              <ul data-thq="thq-dropdown-list" className="home-dropdown-list1">
                <li
                  data-thq="thq-dropdown"
                  className="home-dropdown2 list-item"
                ></li>
                <li
                  data-thq="thq-dropdown"
                  className="home-dropdown3 list-item"
                ></li>
                <li
                  data-thq="thq-dropdown"
                  className="home-dropdown4 list-item"
                ></li>
                <li
                  data-thq="thq-dropdown"
                  className="home-dropdown5 list-item"
                ></li>
              </ul>
            </li>
          </ul>
        </div>
      </header>
      <section className="home-hero">
        <div className="home-heading">
          <h1 className="home-header">
            <span>ANONYMOUS CRIME REPORTING SYSTEM</span>
            <br></br>
            <span>DAPP</span>
            <br></br>
          </h1>
          <p className="home-caption">MAKE YOUR CITY SAFER</p>
        </div>
        <div className="home-buttons">
          <button className="home-view button" onClick={loginWithMetaMask}>REPORT CRIME</button>
          <a href="#learn-3" className="home-learn button-clean button">
            Learn more
          </a>
        </div>
      </section>
      <section className="home-description">
        
          <img
            alt="image"
            src="/hero-divider-1500w.png"
            
            className="home-divider-image"
          />
        
      </section>
      <section className="home-cards">
        <div className="home-row"></div>
        <div className="home-card">
          <div className="home-row1">
            <div className="home-main">
              <div className="home-content">
                <h2 className="home-header1">Login with MetaMask</h2>
                <p className="home-description1">
                  <span>1. Crete a MetaMask Wallet</span>
                  <br></br>
                  <span>2.Change from mainnet to Sepolia teastnet</span>
                  <br></br>
                  <span>3.Add some sepolia to your wallet</span>
                  <br></br>
                  <span>4.Connect your wallet to our website</span>
                  <br></br>
                  <span>5.Now, you can report crime from anywhere </span>
                  <br></br>
                </p>
              </div>
              <a
                href="https://metamask.io/"
                target="_blank"
                rel="noreferrer noopener"
                className="home-learn1 button"
              >
                <span className="home-text22">Learn more</span>
                <img
                  alt="image"
                  src="/Icons/arrow-2.svg"
                  className="home-image"
                />
              </a>
            </div>
            <img
              alt="pastedImage"
              src="/external/pastedimage-ot2k-300h.png"
              className="home-pasted-image"
            />
          </div>
        </div>
        <ChatbotComponent/>
      </section>
      <section className="home-project">
        <div className="home-understand">
          <div className="home-content1">
            <span className="home-caption1">Project</span>
            <div className="home-heading1">
              <h2 id="learn1" className="home-learn2">
                Understand the project
              </h2>
              <p className="home-header2">
                Develop a decentralized application (DApp) on a blockchain
                platform that allows users to anonymously report crimes through
                photos or videos. The goal is to create a secure, transparent,
                and trustless system that empowers individuals to contribute to
                public safety without fear of retaliation
              </p>
            </div>
            <a
              href="#learn-3"
              rel="noreferrer noopener"
              className="home-view1 button-link button"
            >
              <span>Learn More</span>
              <img alt="image" src="/Icons/arrow.svg" className="home-image1" />
            </a>
          </div>
          <img alt="image" src="/group%202415.svg" className="home-image2" />
        </div>
      </section>
      <section className="home-faq" id='learn-3'>
        <h2 className="home-header3">We have all the answers</h2>
        <div className="home-accordion">
          <div
            data-role="accordion-container"
            className="home-element accordion"
          >
            <div className="home-content2">
              <span className="home-header4">
                What is the purpose of this webapp?
              </span>
              <span data-role="accordion-content" className="home-description2">
                The purpose of this webapp is to provide an anonymous platform
                for reporting crimes to the Indian police force.
                <span
                  dangerouslySetInnerHTML={{
                    __html: ' ',
                  }}
                />
              </span>
            </div>
            <div className="home-icon-container">
              <svg
                viewBox="0 0 1024 1024"
                data-role="accordion-icon-closed"
                className="home-icon18"
              >
                <path d="M213.333 554.667h256v256c0 23.552 19.115 42.667 42.667 42.667s42.667-19.115 42.667-42.667v-256h256c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-256v-256c0-23.552-19.115-42.667-42.667-42.667s-42.667 19.115-42.667 42.667v256h-256c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667z"></path>
              </svg>
            </div>
          </div>
          <div
            data-role="accordion-container"
            className="home-element1 accordion"
          >
            <div className="home-content3">
              <span className="home-header5">
                How does the anonymous reporting feature work?
              </span>
              <span data-role="accordion-content" className="home-description3">
                The anonymous reporting feature allows users to submit crime
                reports without revealing their identity. The webapp ensures
                that all personal information is kept confidential.
                <span
                  dangerouslySetInnerHTML={{
                    __html: ' ',
                  }}
                />
              </span>
            </div>
            <div className="home-icon-container1">
              <svg
                viewBox="0 0 1024 1024"
                data-role="accordion-icon-closed"
                className="home-icon20"
              >
                <path d="M213.333 554.667h256v256c0 23.552 19.115 42.667 42.667 42.667s42.667-19.115 42.667-42.667v-256h256c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-256v-256c0-23.552-19.115-42.667-42.667-42.667s-42.667 19.115-42.667 42.667v256h-256c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667z"></path>
              </svg>
            </div>
          </div>
          <div
            data-role="accordion-container"
            className="home-element2 accordion"
          >
            <div className="home-content4">
              <span className="home-header6">Who can use this webapp?</span>
              <span data-role="accordion-content" className="home-description4">
                This webapp is designed for the Indian police force and can be
                used by authorized personnel for receiving and managing crime
                reports.
                <span
                  dangerouslySetInnerHTML={{
                    __html: ' ',
                  }}
                />
              </span>
            </div>
            <div className="home-icon-container2">
              <svg
                viewBox="0 0 1024 1024"
                data-role="accordion-icon-closed"
                className="home-icon22"
              >
                <path d="M213.333 554.667h256v256c0 23.552 19.115 42.667 42.667 42.667s42.667-19.115 42.667-42.667v-256h256c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-256v-256c0-23.552-19.115-42.667-42.667-42.667s-42.667 19.115-42.667 42.667v256h-256c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667z"></path>
              </svg>
            </div>
          </div>
          <div
            data-role="accordion-container"
            className="home-element3 accordion"
          >
            <div className="home-content5">
              <span className="home-header7">
                Is it mandatory to provide personal information while reporting
                a crime?
              </span>
              <span data-role="accordion-content" className="home-description5">
                No, it is not mandatory to provide personal information while
                reporting a crime. Users have the option to remain anonymous.
                <span
                  dangerouslySetInnerHTML={{
                    __html: ' ',
                  }}
                />
              </span>
            </div>
            <div className="home-icon-container3">
              <svg
                viewBox="0 0 1024 1024"
                data-role="accordion-icon-closed"
                className="home-icon24"
              >
                <path d="M213.333 554.667h256v256c0 23.552 19.115 42.667 42.667 42.667s42.667-19.115 42.667-42.667v-256h256c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-256v-256c0-23.552-19.115-42.667-42.667-42.667s-42.667 19.115-42.667 42.667v256h-256c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667z"></path>
              </svg>
            </div>
          </div>
          <div
            data-role="accordion-container"
            className="home-element4 accordion"
          >
            <div className="home-content6">
              <span className="home-header8">
                Can I attach evidence or files along with my crime report?
              </span>
              <span data-role="accordion-content" className="home-description6">
                Yes, you can attach evidence or files while submitting your
                crime report. This can help provide additional information to
                the police for investigation purposes.
              </span>
            </div>
            <div className="home-icon-container4">
              <svg
                viewBox="0 0 1024 1024"
                data-role="accordion-icon-closed"
                className="home-icon26"
              >
                <path d="M213.333 554.667h256v256c0 23.552 19.115 42.667 42.667 42.667s42.667-19.115 42.667-42.667v-256h256c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-256v-256c0-23.552-19.115-42.667-42.667-42.667s-42.667 19.115-42.667 42.667v256h-256c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667z"></path>
              </svg>
            </div>
          </div>
        </div>
      </section>
      <div>
        <div className="home-container8">
        </div>
      </div>
    </div>
  );
};

export default withRouter(Home);
