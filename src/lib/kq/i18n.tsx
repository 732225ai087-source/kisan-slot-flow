import { createContext, useContext } from "react";
import type { Lang } from "./types";

type Dict = Record<string, string>;

const en: Dict = {
  appName: "KISANQUEUE",
  tagline: "Smart Farmer Procurement & Appointment Management System",
  heroSub:
    "Register once. Get your procurement slot. Avoid long waiting queues.",
  registerFarmer: "Register as Farmer",
  officerLogin: "Officer Login",
  adminLogin: "Admin Login",
  home: "Home",
  dashboard: "Dashboard",
  myProducts: "My Procurement Products",
  appointments: "Appointments",
  history: "Procurement History",
  notifications: "Notifications",
  logout: "Logout",
  login: "Login",
  problem: "The Problem",
  solution: "Our Solution",
  howItWorks: "How It Works",
  benefits: "Benefits",
  language: "Language",
  queue: "Daily Queue",
  requests: "Procurement Requests",
  reschedules: "Reschedule Requests",
  centres: "Procurement Centres",
  reports: "Reports",
  verify: "Farmer Verification",
  token: "Token",
  status: "Status",
  quantity: "Quantity",
  product: "Product",
  date: "Date",
  farmer: "Farmer",
};

const ta: Dict = {
  appName: "கிசான்க்யூ",
  tagline: "விவசாயி கொள்முதல் மற்றும் நேர ஒதுக்கீட்டு மேலாண்மை அமைப்பு",
  heroSub:
    "ஒருமுறை பதிவு செய்யுங்கள். கொள்முதல் நேரம் பெறுங்கள். நீண்ட வரிசையை தவிர்க்கவும்.",
  registerFarmer: "விவசாயியாக பதிவு செய்யவும்",
  officerLogin: "அலுவலர் உள்நுழைவு",
  adminLogin: "நிர்வாகி உள்நுழைவு",
  home: "முகப்பு",
  dashboard: "டாஷ்போர்டு",
  myProducts: "எனது கொள்முதல் பொருட்கள்",
  appointments: "நேர ஒதுக்கீடு",
  history: "கொள்முதல் வரலாறு",
  notifications: "அறிவிப்புகள்",
  logout: "வெளியேறு",
  login: "உள்நுழைக",
  problem: "பிரச்சனை",
  solution: "தீர்வு",
  howItWorks: "எப்படி செயல்படுகிறது",
  benefits: "நன்மைகள்",
  language: "மொழி",
  queue: "தினசரி வரிசை",
  requests: "கொள்முதல் கோரிக்கைகள்",
  reschedules: "தேதி மாற்ற கோரிக்கைகள்",
  centres: "கொள்முதல் நிலையங்கள்",
  reports: "அறிக்கைகள்",
  verify: "விவசாயி சரிபார்ப்பு",
  token: "டோக்கன்",
  status: "நிலை",
  quantity: "அளவு",
  product: "பொருள்",
  date: "தேதி",
  farmer: "விவசாயி",
};

const hi: Dict = {
  appName: "किसानक्यू",
  tagline: "स्मार्ट किसान खरीद एवं अपॉइंटमेंट प्रबंधन प्रणाली",
  heroSub:
    "एक बार पंजीकरण करें। खरीद स्लॉट पाएं। लंबी कतारों से बचें।",
  registerFarmer: "किसान पंजीकरण",
  officerLogin: "अधिकारी लॉगिन",
  adminLogin: "एडमिन लॉगिन",
  home: "होम",
  dashboard: "डैशबोर्ड",
  myProducts: "मेरी खरीद फसलें",
  appointments: "अपॉइंटमेंट",
  history: "खरीद इतिहास",
  notifications: "सूचनाएं",
  logout: "लॉगआउट",
  login: "लॉगिन",
  problem: "समस्या",
  solution: "समाधान",
  howItWorks: "यह कैसे काम करता है",
  benefits: "लाभ",
  language: "भाषा",
  queue: "दैनिक कतार",
  requests: "खरीद अनुरोध",
  reschedules: "पुनर्निर्धारण अनुरोध",
  centres: "खरीद केंद्र",
  reports: "रिपोर्ट",
  verify: "किसान सत्यापन",
  token: "टोकन",
  status: "स्थिति",
  quantity: "मात्रा",
  product: "फसल",
  date: "दिनांक",
  farmer: "किसान",
};

const DICTS: Record<Lang, Dict> = { en, ta, hi };

export const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  ta: "தமிழ்",
  hi: "हिंदी",
};

export const LangContext = createContext<Lang>("en");

export function useT() {
  const lang = useContext(LangContext);
  return (key: keyof typeof en) => DICTS[lang][key] ?? en[key] ?? String(key);
}
