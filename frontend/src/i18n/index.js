import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      hero_description: "Jeelani Studies Centre is dedicated to promoting Islamic education, Sufism, and the teachings of Thareeqath and Thowheed. Our mission is to foster an spiritual renaissance through moral education and proper guidance.",
      contact_message: "Contact us to learn more about our programs and services."
    }
  },
  ml: {
    translation: {
      hero_description: "ഇസ്‌ലാമിക വിദ്യാഭ്യാസവും, സൂഫി പാരമ്പര്യവും, ത്വരീഖത്തും, തൗഹീദും പ്രോത്സാഹിപ്പിക്കുന്നതിലൂടെയും, ആധുനിക വിദ്യാഭ്യാസ സ്ഥാപനങ്ങൾക്കും ആത്മീയമായ സമഗ്ര മാർഗ നിർദേശങ്ങൾക്കും വഴിയൊരുക്കിയും കൊണ്ട്, ഇസ്‌ലാമിക ഉണർവിന്റെ ഒരു പുതു അധ്യായം തുടങ്ങുക എന്നതാണ് ജീലാനി സ്റ്റഡീസ് സെന്ററിന്റെ ലക്ഷ്യം.",
      contact_message: "ഞങ്ങളുടെ പ്രോഗ്രാമുകളെയും സേവനങ്ങളെയും കുറിച്ച് കൂടുതലറിയാൻ ഞങ്ങളെ ബന്ധപ്പെടുക."
    }
  },
  ur: {
    translation: {
      hero_description:"جیلانی اسٹڈیز سینٹر کے قیام کا مقصد اسلامی تعلیم، تصوف، شریعت و طریقت ، توحید و رسالت اور اس کی تعلیمات کی نشرواشاعت کرنا ہے۔ ہم چاہتے ہیں کہ معیاری تعلیمی اداروں اور روحانی پیشوا کے ضیابار کرنوں سے عوام میں اسلامی ماحول پیدا ہو اور نوجوانان اسلام کی فکری و عملی بے راہ روی پر روک تھام ہو ۔",
      contact_message: "ہمارے پروگراموں اور خدمات کے بارے میں مزید جاننے کے لیے ہم سے رابطہ کریں۔"
    }
  },
  ar: {
    translation: {
      hero_description: "مركز جيلاني للدراسات مكرس لتعزيز التعليم الإسلامي والتصوف وتعاليم الطريقة والتوحيد. مهمتنا هي تعزيز النهضة الإسلامية من خلال المؤسسات التعليمية المهنية والإرشاد الروحي الشامل.",
      contact_message: "تواصلوا معنا لمعرفة المزيد عن برامجنا وخدماتنا."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;