import type { ServiceCategory } from "./types";

/**
 * Herman Family Dentistry's full list of services, in their own words, from the service pages on
 * vincennesdentalpractice.com (Nov 2026). Generated from those pages; group names are ours, the
 * services and text are theirs. Each service gets its own page (app/services/[slug]).
 */
export const hermanCatalog: ServiceCategory[] = [
  {
    id: "preventive",
    name: "Preventive care",
    intro:
      "Lifetime oral health starts with regular dental visits for cleanings and preventive checkups. Herman Family Dentistry offers many services and treatments to keep your teeth healthy and strong. Our team is happy to answer questions and also provide recommendations for the best oral hygiene techniques you can practice at home between visits.",
    services: [
      {
        id: "exams-cleanings",
        name: "Exams & Cleanings",
        summary:
          "Patients should visit our practice for checkups and teeth cleanings at least twice a year.",
        body: [
          [
            "p",
            "Patients should visit our practice for checkups and teeth cleanings at least twice a year. Our skilled dentists and staff will be able to diagnose and treat potentially dangerous oral health concerns by catching them at an early stage. Checkups include diagnostics like x-rays and intraoral cameras, a complete evaluation, a thorough cleaning, and a consultation to go over your oral health and develop a personalized treatment plan.",
          ],
        ],
      },
      {
        id: "sealants",
        name: "Sealants",
        summary:
          "Sealants are typically recommended for younger patients whose teeth and oral hygiene skills are still developing.",
        body: [
          [
            "p",
            "Sealants are typically recommended for younger patients whose teeth and oral hygiene skills are still developing. They create a barrier between teeth and damaging bacteria and plaque. Sealants can be quickly placed as part of any regular checkup and cleaning by first applying the liquid sealant and then hardening the material into position over the teeth, sealing out harmful bacteria.",
          ],
        ],
      },
      {
        id: "denture-cleanings",
        name: "Denture & Partial Denture Cleanings",
        summary:
          "Plaque and tartar build up on dentures just like natural teeth, and once plaque hardens into tartar, it can cause bacterial accumulation and tissue problems.",
        body: [
          [
            "p",
            "Plaque and tartar build up on dentures just like natural teeth, and once plaque hardens into tartar, it can cause bacterial accumulation and tissue problems. Dentures require daily care at home and professional cleaning by a dental professional. Tartar is very hard and cannot be removed by brushing or soaking dentures but it can be removed by an ultrasonic machine in our office.",
          ],
        ],
      },
      {
        id: "fluoride",
        name: "Fluoride Treatments",
        summary:
          "Fluoride treatments are a fast, simple way to fortify tooth enamel on children whose teeth are developing and adults who experience frequent tooth decay.",
        body: [
          [
            "p",
            "Fluoride treatments are a fast, simple way to fortify tooth enamel on children whose teeth are developing and adults who experience frequent tooth decay. Fluoride treatments are also effective in decreasing dental sensitivity. Fluoride attracts nutrients essential to the health of tooth enamel to strengthen it and help prevent tooth decay. Most toothpastes and mouth rinses contain a limited amount of fluoride, but the topical fluoride applied in our office has significantly larger amounts keeping it active longer.",
          ],
        ],
      },
      {
        id: "laser-periodontal-therapy",
        name: "Laser Periodontal Therapy",
        summary:
          "We use soft tissue lasers to gently remove bacteria, plaque, and tartar effectively from below the gum line.",
        body: [
          [
            "p",
            "We use soft tissue lasers to gently remove bacteria, plaque, and tartar effectively from below the gum line. This procedure allows us to accurately target specific areas of the gums, resulting in minimal tissue loss and maximum comfort during your visit and the healing process.",
          ],
        ],
      },
      {
        id: "oral-cancer-screenings",
        name: "Oral Cancer Screenings",
        summary:
          "Oral cancer screenings are important as part of your dental checkup.",
        body: [
          [
            "p",
            "Oral cancer screenings are important as part of your dental checkup. The quick, painless examinations performed by our dentists as part of your checkup allow our team to find signs of oral cancer and recommend further care whenever necessary. If you notice any of the following symptoms, be sure to tell us at your next visit: flat or discolored patches on soft tissue; constant throbbing or sharp pain in the mouth, lip, tongue, throat or neck; difficulty speaking or a constant sore throat; a cut, scrape, or sore in the mouth that does not heal quickly.",
          ],
        ],
      },
      {
        id: "night-athletic-guards",
        name: "Night & Athletic Guards",
        summary:
          "Some people occasionally grind their teeth and do not need treatment, but others can develop a severe habit that can cause serious damage to their teeth and jaw.",
        body: [
          [
            "p",
            "Some people occasionally grind their teeth and do not need treatment, but others can develop a severe habit that can cause serious damage to their teeth and jaw. Teeth grinding, also known as bruxism, can be so damaging over time some people wear their teeth down to tiny stumps and need to have a full-mouth restoration. Many people only grind their teeth at night, so you may not be aware that you are damaging your teeth; however, it is possible to grind or clench your teeth during the day as well. It’s important to seek treatment immediately if you suspect you may suffer from teeth grinding. Night guards and athletic guards can help protect your teeth while you sleep and while participating in sports. If left untreated, bruxism can also affect your jaw and can lead to fractured teeth, tooth sensitivity, loose teeth, hearing loss, changing facial appearance, TMJ disorders, chronic pain, and headaches.",
          ],
        ],
      },
    ],
  },
  {
    id: "restorative",
    name: "Restorative care",
    intro:
      "We are dedicated to helping you achieve and maintain great oral health with regular checkups and cleanings. Sometimes, restorative dentistry is also needed to renew the function and appearance of teeth. These services include crowns, bridges, dentures, fillings, and more.",
    services: [
      {
        id: "implants",
        name: "Implants",
        summary: "Are you missing one or more teeth?",
        body: [
          [
            "p",
            "Are you missing one or more teeth? If you are looking for a permanent solution close to home, we provide dental implants in Vincennes, IN, which may be the perfect choice for you! We offer replacement teeth that look, feel, and function just like natural teeth.",
          ],
          ["h", "How Do Implants Work?"],
          [
            "p",
            "We are proud to offer advanced restorative dentistry to Vincennes, IN, and the surrounding area. Implants are small posts made of titanium metal that function as the root of a tooth. They fuse to your jawbone to create a secure foundation.",
          ],
          ["h", "Once healed, implants provide strong support for:"],
          ["li", "Crowns"],
          ["li", "Bridges"],
          ["li", "Dentures"],
          ["h", "Why Choose Implants?"],
          [
            "li",
            "Natural Feel: They eliminate the discomfort of tooth loss, giving you a seamless smile.",
          ],
          [
            "li",
            "Longevity: With good oral hygiene and regular visits to our office in Vincennes, IN, dental implants can last a lifetime.",
          ],
          [
            "li",
            "Versatility: Single-tooth implants are perfect for individual gaps, while multiple implants can support a full arch if all upper or lower teeth are missing.",
          ],
          ["h", "Implant-Supported Dentures"],
          [
            "p",
            "For our patients in Vincennes, IN missing all their teeth, we can use implants to anchor dentures securely. Unlike traditional removable options, implant-supported dentures fit perfectly. You can go about your daily life without worrying about slipping or discomfort.",
          ],
          [
            "p",
            "We are proud to be a premier destination for restorative dentistry, serving patients throughout Southern Indiana and Southwestern Illinois. While our practice is based in Vincennes, IN, our reputation for excellence draws patients from across the region who are seeking top-quality dental implant care. We warmly welcome individuals from Princeton, Washington, and Petersburg, IN, as well as our neighbors across the state line in Olney, Mount Carmel, Lawrenceville, and Robinson, IL. No matter which of these communities you call home, our dedicated team is here to provide you with exceptional implant solutions that are well worth the trip.",
          ],
        ],
      },
      {
        id: "same-day-crowns",
        name: "CEREC Same-Day Crowns",
        summary: "Do you have a cracked or broken tooth?",
        body: [
          [
            "p",
            "Do you have a cracked or broken tooth? At Herman Family Dentistry, we understand that you don’t have weeks to wait for a restoration. That is why we are proud to offer state-of-the-art CEREC crowns in Vincennes, IN.",
          ],
          [
            "p",
            "Unlike traditional methods that require multiple trips to the dentist, CEREC technology allows us to craft and place beautiful ceramic restorations in a single visit.",
          ],
          ["h", "The Benefits of CEREC Same-Day Crowns"],
          [
            "p",
            "You may be the perfect candidate for this cutting-edge solution. Using advanced CAD/CAM (Computer-Aided Design/Manufacturing) technology and 3D imaging, we design your custom crown right in our office.",
          ],
          ["h", "Why Vincennes patients love CEREC crowns:"],
          [
            "li",
            "Speed: Walk in with a damaged tooth and walk out with a permanent crown the same day.",
          ],
          ["li", "Comfort: No “goopy” impression trays that cause gagging."],
          [
            "li",
            "Convenience: No need to wear a fragile temporary crown for weeks.",
          ],
          [
            "li",
            "Efficiency: Save time from your busy schedule with fewer appointments.",
          ],
          ["h", "Lab-Crafted Crowns for Superior Aesthetics"],
          [
            "p",
            "While CEREC is an amazing solution for many, there are specific cases where a lab-crafted crown is the ideal choice. This is often true for front teeth where aesthetics are critical.",
          ],
          [
            "p",
            "To ensure your smile looks natural and flawless, Herman Family Dentistry partners with reputable dental labs to create custom restorations. Although this process typically requires two appointments—one for design and impressions, and a second for placement—it ensures the most natural-looking result for highly visible teeth.",
          ],
          ["h", "Which Option is Right for You?"],
          [
            "p",
            "Whether you choose a same-day CEREC crown or a lab-crafted porcelain crown, our goal is to provide a beautiful restoration and long-lasting protection. We will examine your specific case and help you determine the best treatment plan for your smile.",
          ],
        ],
      },
      {
        id: "prettau-implant-bridges",
        name: "Prettau® Implant Bridges",
        summary:
          "The Prettau® Implant Bridge is a major step forward in restorative dentistry.",
        body: [
          ["h", "Change your life with the Prettau ® Implant Bridge!"],
          [
            "p",
            "The Prettau® Implant Bridge is a major step forward in restorative dentistry. These dental bridges are supported by dental implants, which are artificial tooth roots that are surgically placed into the jawbone and gum tissue, allowing for incredibly secure hold. The artificial teeth are made from zirconia, which is an amazingly sturdy and natural-looking material. The Prettau® Bridge is the longest lasting, most effective way to replace your missing teeth.",
          ],
          [
            "p",
            "Herman Family Dentistry also offers traditional fixed bridges which are made of porcelain fused to metal. These consist of two crowns which go over two anchoring teeth (abutment teeth) and are attached to pontics (artificial teeth). The traditional fixed bridge fills the gap created by one or more missing teeth. We will discuss your unique needs to help you decide if a Prettau® Bridge or traditional bridge is right for you.",
          ],
          [
            "p",
            "Our knowledgeable staff will help you learn more about the Prettau® Implant Bridge and how it can change your life!",
          ],
          [
            "h",
            "If you are considering dental implants or implant supported bridges, contact us for a free evaluation.",
          ],
        ],
      },
      {
        id: "dentures-partials",
        name: "Dentures & Partials",
        summary:
          "Patients who are missing a number of teeth may be candidates for dentures which are natural-looking replacement teeth that are removable.",
        body: [
          [
            "p",
            "Patients who are missing a number of teeth may be candidates for dentures which are natural-looking replacement teeth that are removable. There are two types of dentures: full and partial.",
          ],
          [
            "p",
            "The fit of your dentures can change over time, so they should be professionally relined every 1-2 years to ensure that they remain secure in your mouth and function properly. Small adjustments can be made to your denture. The aesthetic aspects of your appliance may be compromised to make up for structural concerns or a lack of space in your mouth. Denture adjustments are very important after you have received immediate dentures, as your mouth will heal and change following the extraction of your teeth. If the fit of your denture changes or if you are experiencing discomfort, or if your denture is damaged or broken, call us for an appointment. We can adjust or repair your denture as needed and restore it. Your denture needs to be in good condition in order to function properly and allow you to chew, speak, and smile with confidence!",
          ],
        ],
      },
      {
        id: "root-canals",
        name: "Root Canal Therapy",
        summary:
          "Endodontics is a specialized branch of dentistry that deals with the complex structures found inside the teeth.",
        body: [
          [
            "p",
            "Endodontics is a specialized branch of dentistry that deals with the complex structures found inside the teeth. Endodontic treatment (or root canal therapy) is performed to save the natural tooth. Many people need a root canal after a deep cavity has grown down into the root of the tooth. In this situation, the decay needs to be removed as soon as possible so the tooth can be saved. In spite of the many advanced restorations available, most dentists agree that there is no substitute for healthy, natural teeth.",
          ],
        ],
      },
      {
        id: "extractions",
        name: "Tooth Extractions",
        summary:
          "We offer simple and surgical extractions of single teeth and full-mouth extractions.",
        body: [
          [
            "p",
            "We offer simple and surgical extractions of single teeth and full-mouth extractions. We strive to preserve natural teeth, but there are some cases when tooth extraction is the best solution to maintain overall oral health.",
          ],
          [
            "p",
            "Full-mouth extraction is sometimes necessary for patients with severe tooth decay, periodontal disease, infections or abscesses, or fractured teeth. Many times, the patient experiences acute or chronic pain that can only be relieved with full-mouth extraction. Once it has been decided that full-mouth extraction is necessary, we’ll create a plan for restoring your smile following the procedure. Removable or implant dentures frequently provide the ideal solution for patients needing full-mouth extractions.",
          ],
        ],
      },
      {
        id: "fillings",
        name: "Tooth-Colored Fillings",
        summary:
          "Silver-colored amalgam fillings have been the standard in restoring damaged or decayed teeth for many years.",
        body: [
          [
            "p",
            "Silver-colored amalgam fillings have been the standard in restoring damaged or decayed teeth for many years. We offer a more cosmetically appealing alternative: tooth-colored composite resin fillings. The direct filling is placed and shaped directly onto the damaged tooth and hardened into position, creating a solid bond between the composite resin and the tooth. Unlike traditional fillings, which expand and contract due to changes in temperature, tooth-colored composite resin fillings provide added stability and preserve dental structure longer.",
          ],
        ],
      },
    ],
  },
  {
    id: "cosmetic",
    name: "Cosmetic dentistry",
    intro:
      "A healthy, white, beautiful smile enhances your appearance and adds to your confidence. Herman Family Dentistry can help you find the best cosmetic solutions to give you the smile you want! If you want to make a change in the appearance of your teeth, we offer the latest options for your smile makeover.",
    services: [
      {
        id: "clear-aligners",
        name: "Clear Aligners",
        summary:
          "Clear aligners provide an effective way to straighten your teeth while remaining virtually invisible.",
        body: [
          [
            "p",
            "Clear aligners provide an effective way to straighten your teeth while remaining virtually invisible. Wearing the comfortable, customized aligners will gradually shift your teeth into their correct position. Correcting teeth alignment is imperative, not just cosmetically, but for overall health. Clear aligners offer the best of both worlds: comfortable, efficient straightening with an essentially invisible appearance.",
          ],
          [
            "h",
            "To schedule a consultation, please contact us. Together, we can shape the smile of your dreams!",
          ],
        ],
      },
      {
        id: "veneers",
        name: "Porcelain Veneers",
        summary:
          "Are you hiding your smile because of chips, cracks, or stubborn stains?",
        body: [
          [
            "p",
            "Are you hiding your smile because of chips, cracks, or stubborn stains? Many of our patients at Herman Family Dentistry worry that achieving a perfect look requires months of intensive dental work. However, we offer a fast, effective alternative to revitalize your appearance: Porcelain Veneers.",
          ],
          [
            "p",
            "Serving the Petersburg and Pike County community, our team specializes in using these thin, durable sheaths of dental-grade porcelain to instantly conceal and correct a variety of common smile flaws.",
          ],
          ["h", "Why Choose Veneers at Herman Family Dentistry?"],
          [
            "p",
            "Veneers are the “gold standard” for a smile makeover because they address multiple issues at once, including:",
          ],
          ["li", "Gaps and Spacing: Close unsightly gaps without braces."],
          [
            "li",
            "Permanent Whitening: Cover deep discoloration that traditional bleaching can’t fix.",
          ],
          ["li", "Structural Repair: Mask chips, cracks, and uneven edges."],
          [
            "li",
            "Worn Teeth: Restore the youthful length of teeth worn down by age or grinding.",
          ],
          ["h", "Our Simple 2-Visit Process"],
          [
            "p",
            "We believe high-quality cosmetic dentistry should be convenient for our Vincennes neighbors. In most cases, your new smile takes just two short appointments:",
          ],
          [
            "li",
            "The Consultation: We begin with a comprehensive cosmetic evaluation to ensure veneers are the right fit for your goals and oral health.",
          ],
          [
            "li",
            "The Transformation: Our team creates a precise, custom treatment plan. Once your final veneers are placed, you can enjoy a radiant, confident smile for decades to come.",
          ],
        ],
      },
      {
        id: "smile-transformation",
        name: "Full Smile Transformation",
        summary:
          "A full mouth reconstruction with custom crowns restores your bite, your oral health and a naturally beautiful smile.",
        body: [
          ["h", "What is full mouth reconstruction?"],
          ["li", "Restore the function of your bite"],
          ["li", "Improve your overall oral health"],
          ["li", "Create a naturally beautiful smile"],
          ["h", "Who needs full mouth restoration?"],
          ["li", "Multiple Missing Teeth"],
          [
            "li",
            "Damaged Teeth: cracked, broken, extensively decayed, or worn down from years of grinding",
          ],
          [
            "li",
            "Chronic pain/Chewing Problems: Issues with your bite or chronic jaw pain",
          ],
          [
            "li",
            "Failing Dental Work: old, large, or failing fillings, crowns, or bridges",
          ],
          [
            "li",
            "Congenital Conditions: born with conditions affecting the development of teeth",
          ],
          ["h", "The Full Mouth Reconstruction Process"],
          [
            "li",
            "Evaluation: thorough examination of your teeth, gums, jaw, bite, and facial structure",
          ],
          [
            "li",
            "Diagnostics: includes digital x-rays, 3D imaging, intraoral scanning (to create a precise model of your mouth",
          ],
          [
            "li",
            "Personalized Treatment Plan: We discuss your concerns, goals, and expectations. A customized, multi-phase plan is developed, outlining the specific procedures, estimated timeline, and cost",
          ],
          [
            "li",
            "Preparatory Procedures: temporaries are placed while the work on your new smile begins.",
          ],
          ["li", "Delivery of Custom Crowns"],
          ["li", "Post op, Final Adjustments"],
          ["h", "Benefits:"],
          [
            "li",
            "Regain the ability to Eat Comfortably, Speak Clearly, and Smile Confidently.",
          ],
          ["li", "Eliminate Chronic Pain"],
          ["li", "Improve your Oral Health"],
          [
            "li",
            "Enhanced Aesthetics: Achieve a stunning, natural, balanced smile",
          ],
          ["li", "Transformation that improves your quality of life"],
        ],
      },
    ],
  },
  {
    id: "gum-care",
    name: "Gum care",
    intro:
      "Periodontal disease attacks the gums and the bone that support the teeth and is characterized by red, swollen, and bleeding gums. Four out of five people have periodontal disease and don’t know it because the disease is usually painless in the early stages. The risk of periodontal disease is also increased by smoking. Periodontal disease is the number one reason for tooth loss and research suggests that there may be a link between periodontal disease and other diseases such as stroke, bacterial pneumonia, diabetes, cardiovascular disease, and increased risk during pregnancy. Researchers are determining if inflammation and bacteria associated with periodontal disease also affects these systemic diseases and conditions.",
    services: [
      {
        id: "gum-recession",
        name: "Gum Recession",
        summary:
          "Gum recession is the progressive loss of gum tissue which can eventually cause tooth root exposure.",
        body: [
          [
            "p",
            "Gum recession is the progressive loss of gum tissue which can eventually cause tooth root exposure. Regular dental checkups will help prevent gum recession and assess risk factors. Symptoms of gum recession include tooth sensitivity, visible roots, longer looking teeth, halitosis (bad breath), inflammation, and bleeding. It can be caused by overly aggressive brushing, poor oral hygiene, chewing tobacco, and periodontal disease. Once the cause of gum recession has been determined, surgical and non-surgical procedures can be performed to halt its progression and correct it.",
          ],
        ],
      },
      {
        id: "scaling-root-planing",
        name: "Scaling & Root Planing",
        summary:
          "Scaling and root planing removes dental plaque and tartar, also called calculus.",
        body: [
          [
            "p",
            "Scaling and root planing removes dental plaque and tartar, also called calculus. These non-surgical procedures completely clean the periodontium and work effectively for patients suffering from gingivitis (mild gum inflammation) and moderate/severe periodontal disease. Periodontal scaling and root planing may be necessary for disease prevention, tooth protection, aesthetic effects, and better breath. Scaling is performed with special dental instruments and may include an ultrasonic scaling tool to remove calculus and plaque from the surface of the crown and root surfaces. Root planing removes cementum and surface dentin that is embedded with unwanted microorganisms, toxins and tartar. The root of the tooth is smoothed in order to promote healing. Having clean, smooth root surfaces helps prevent bacteria from easily colonizing in future. The gum pockets may be treated with antibiotics after these deep cleaning procedures to soothe irritation and help the gum tissues to heal quickly.",
          ],
        ],
      },
      {
        id: "pocket-irrigation",
        name: "Pocket Irrigation",
        summary:
          "Pocket irrigation can assist in treating the progression of periodontal disease.",
        body: [
          [
            "p",
            "Pocket irrigation can assist in treating the progression of periodontal disease. It aims to clean plaque from between the teeth (interdental) and under the gum line (subgingival) areas of the mouth in order to prevent the colonization of harmful oral bacteria. Pocket irrigation is also used to deliver antibacterial agents to the subgingival areas. It can be beneficial for interdental cleaning, the prevention of halitosis (bad breath), and subgingival cleaning. This helps keep the gum pockets cleaner and shallower, helping the gum tissue remain healthy. Pocket irrigation is generally performed in combination with other dental treatments, such as professional dental cleaning or pocket reduction surgery.",
          ],
        ],
      },
      {
        id: "pocket-reduction-surgery",
        name: "Pocket Reduction Surgery",
        summary:
          "Pocket reduction surgery aims at gaining access to the roots of the teeth in order to remove bacteria and tartar (calculus) in the treatment of periodontal disease, a progressive condition which can lead to tooth loss.",
        body: [
          [
            "p",
            "Pocket reduction surgery aims at gaining access to the roots of the teeth in order to remove bacteria and tartar (calculus) in the treatment of periodontal disease, a progressive condition which can lead to tooth loss. Periodontal infections cause a chronic inflammatory response that destroys bone and gum tissues once they invade the subgingival area below the gum line. The goals of pocket reduction surgery are the reduction of bacterial spread, halting bone loss, facilitation of home care, and enhancing the smile. It can be performed under local or general anesthetic according to patient preference.",
          ],
        ],
      },
      {
        id: "soft-tissue-laser",
        name: "Soft Tissue Laser",
        summary:
          "We use soft tissue lasers to treat gum disease in the advanced stages.",
        body: [
          [
            "p",
            "We use soft tissue lasers to treat gum disease in the advanced stages. The laser speeds healing time and minimizes discomfort. We also use soft tissue laser dentistry for cosmetic purposes such as reshaping soft tissue for patients who have “gummy” smiles or whose gum lines are uneven.",
          ],
        ],
      },
    ],
  },
  {
    id: "specialty",
    name: "Specialty care",
    intro:
      "Herman Family Dentistry offers specialty dentistry to our valued patients. Our office has the latest technology and our team has extensive training to offer our patients the very best in modern, comprehensive dental care.",
    services: [
      {
        id: "sedation",
        name: "Sedation Dentistry",
        summary:
          "We understand that some patients need a little extra something to make their dental visit more comfortable.",
        body: [
          ["h", "Enjoy a Trip to the Dentist Without the Fear."],
          [
            "p",
            "We understand that some patients need a little extra something to make their dental visit more comfortable. For those who are fearful about dental visits, we offer nitrous oxide as well as conscious oral sedation to help you relax and enjoy a trip to the dentist without fear.",
          ],
          ["h", "Nitrous Oxide"],
          [
            "p",
            "Nitrous oxide is sometimes called “laughing gas” and is a safe and effective sedative agent that is mixed with oxygen and inhaled through a small mask that fits over your nose to help you relax. It will help you relax and is not intended to put you to sleep. You will still be able to hear and respond to any requests or directions the dentist may have. You will be asked to breathe normally through your nose, and within a few short minutes you should start to feel the effects of the nitrous oxide. You may feel light-headed or feel a tingling sensation in your arms and legs. Some patients say their arms and legs feel heavy. Ultimately, you should feel calm and comfortable from the nitrous oxide. The effects wear off soon after the mask is removed.",
          ],
          ["h", "Oral Sedation"],
          [
            "p",
            "We offer conscious oral sedation dentistry for our patients who are uncomfortable with the common sounds and sensations of regular dental exams or complex procedures. Conscious oral sedation will make you feel more relaxed if you have a sensitive gag reflex or are uncomfortable with the thought of someone working on your teeth. Conscious oral sedation dentistry is safe and available to most adult patients. Oral sedation is given via an oral medication that will make you feel comfortable and alert during the procedure. Unlike general anesthesia where a patient is completely unconscious, the patient can interact with the dentist, but typically has no memory of the procedure. Since the sedative effect can last several hours after administration, you will need someone to drive you home after your dental procedure is done.",
          ],
        ],
      },
      {
        id: "sleep-apnea",
        name: "Sleep Apnea Therapy",
        summary:
          "Oral appliance therapy is an effective treatment option for snoring and sleep apnea, and it’s available right here at Herman Family Dentistry.",
        body: [
          [
            "h",
            "Improve Your Sleep, Restore Your Alertness, and Revitalize Your Health",
          ],
          [
            "p",
            "Oral appliance therapy is an effective treatment option for snoring and sleep apnea, and it’s available right here at Herman Family Dentistry. Improve your sleep, restore your alertness, and revitalize your health with a custom-fit oral sleep appliance. Many patients highly prefer using an oral sleep appliance like the Moses® to a CPAP machine. Ask us today about this life-changing treatment.",
          ],
          [
            "p",
            "Obstructive sleep apnea (OSA) results from a collapsed airway due to an obstruction. Sleep apnea can cause a number of problems that may endanger overall health. Depending on the severity of the condition and a patient’s lifestyle, the symptoms may range from mild to severe. Sleep deprivation and oxygen deprivation, the two primary effects of sleep apnea, can lead to serious health conditions.",
          ],
          [
            "p",
            "For many apnea sufferers, oral appliances can relieve most or all symptoms associated with the condition and help patients get deep restorative sleep without interruption. Oral appliances are a safe, holistic way to treat sleep apnea and can be customized for comfort. As technology in this area of dentistry continues to improve, sleep apnea patients have a more effective and convenient option for the relief of symptoms including snoring.",
          ],
          [
            "p",
            "The Moses® appliance is a comfortable, highly-effective method for sleep apnea treatment. Many of our patients prefer this smaller sized appliance to the often dreaded CPAP machine. The Moses® is customized so the patient can easily talk, drink, open wide and close their lips. They no longer have the discomfort of dry mouth in the mornings. The claustrophobic locked jaw and mouth breather designs of earlier mandibular advancement devices are eliminated. After a short time, you forget it is in! Patients wear it because they feel better now that their symptoms are reduced or completely diminished.",
          ],
          [
            "h",
            "If you or your loved one snore, or exhibit other signs of sleep apnea, we recommend scheduling an evaluation with Dr. Herman today!",
          ],
        ],
      },
      {
        id: "tmj-botox",
        name: "BOTOX® TMD/TMJ Treatments",
        summary:
          "Is the pain in your jaw too much to handle, and you want relief?",
        body: [
          [
            "h",
            "Safe and Effective Temporomandibular Joint Disorder (TMD) Treatments",
          ],
          [
            "p",
            "Is the pain in your jaw too much to handle, and you want relief? Herman Family Dentistry may have the perfect solution with BOTOX® in Vincennes. Dr. Karen Schenk specializes in treating patients with BOTOX® suffering from TMD (also called TMJ). If you need pain relief, BOTOX® is a safe and effective method of treatment.",
          ],
          [
            "p",
            "Botulinum toxin, commonly known as Botox, is very effective and popular among those looking to reduce the affect of aging. Some problem areas Botox is used for include:",
          ],
          ["li", "Crow’s feet"],
          ["li", "Frown lines"],
          ["li", "Wrinkles"],
          [
            "p",
            "It is also very beneficial and successful in treating patients suffering from TMD including severe headaches.",
          ],
          [
            "p",
            "When Botox is injected into specific areas of the face, it prevents muscles from contracting and causing creases in the skin when smiling, laughing, or even yawning.",
          ],
          [
            "p",
            "Its successful treatment of cosmetic problems has made Botox a common service offered by dentists and skincare professionals alike. However, its success in providing relief to those suffering jaw pain, teeth grinding, and debilitating discomfort is becoming more and more popular.",
          ],
          [
            "p",
            "Botox treatment relieves tension in the jaw by preventing muscles from moving in such a way that results in migraines and severe pain.",
          ],
          [
            "p",
            "Patients will begin to see a dramatic difference in how they feel and look in a matter of one or two days. However, it can take up to a week or more to experience the full effects of Botox.",
          ],
          [
            "p",
            "If you are interested in Botox treatment, Dr. Schenk will look at your medical history, current oral and overall health, and examine your mouth to determine if Botox is right for you.",
          ],
          [
            "p",
            "She will explain how the process works and its benefits so you can feel confident in your decision to pursue Botox. Some additional benefits that come with Botox include:",
          ],
          ["li", "Relief from jaw tension"],
          [
            "li",
            "Greatly reduce fine lines around your eyes, nose, lips, and neck",
          ],
          ["li", "Relieve discomfort brought on by migraine headaches"],
          [
            "li",
            "Allows an alternative option for treating patients suffering from migraines who rely on pain medication",
          ],
          [
            "li",
            "Serves as a non-surgical option to improve facial appearance",
          ],
          [
            "p",
            "You can feel confident that Dr. Karen Schenk received specialized training to administer Botox and can perform the injections safely while making sure your oral health is in no way negatively impacted.",
          ],
          [
            "p",
            "Another benefit is that everything can be done in one appointment. If you’re already coming in for a regular dental cleaning and checkup, let us know you would like to discuss Botox with Dr. Schenk. Rest assured, your comfort and privacy are our top priority. If you’ve been noticing soreness, pain, or any mouth discomfort, give us a call, and we’ll schedule you an appointment.",
          ],
        ],
      },
      {
        id: "digital-x-rays",
        name: "Digital X-Rays",
        summary:
          "Digital X-rays offer higher definition images than traditional x-rays, expose patients to 90% less radiation, and do not need to be developed.",
        body: [
          [
            "p",
            "Digital X-rays offer higher definition images than traditional x-rays, expose patients to 90% less radiation, and do not need to be developed. Instead, the images are instantly visible on chairside monitors. Our team can emphasize certain areas, zoom in on specific teeth, and easily transfer X-rays to patients, specialists, and insurance providers.",
          ],
        ],
      },
    ],
  },
];
