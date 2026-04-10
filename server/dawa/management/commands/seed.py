"""
Demo seeder for Dawa MVP.

Run:
    python manage.py seed
    python manage.py seed --clear   # wipe existing data first

Demo accounts created
---------------------
Patient   : +213555000001 / demo1234
Pharmacist: +213555000002 / demo1234  (owns Pharmacie El Amel)
Pharmacist: +213555000003 / demo1234  (owns Pharmacie Ibn Sina)
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta


class Command(BaseCommand):
    help = "Seed the database with demo pharmacies, medicines, products and users"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Delete existing seed data before inserting",
        )

    def handle(self, *args, **options):
        from dawa.models import User, Pharmacy, Medicine, AvailabilityReport, Product

        if options["clear"]:
            self.stdout.write("Clearing existing data…")
            AvailabilityReport.objects.all().delete()
            Product.objects.all().delete()
            Pharmacy.objects.all().delete()
            Medicine.objects.all().delete()
            User.objects.filter(phone__startswith="+21355500").delete()
            self.stdout.write(self.style.WARNING("Data cleared."))

        # ── Users ─────────────────────────────────────────────────────────────
        self.stdout.write("Creating demo users…")

        patient, _ = User.objects.get_or_create(
            phone="+213555000001",
            defaults=dict(name="Karim Bensalem", role="patient", wilaya="Constantine"),
        )
        patient.set_password("demo1234")
        patient.save()

        ph_user1, _ = User.objects.get_or_create(
            phone="+213555000002",
            defaults=dict(name="Dr. Amira Boudiaf", role="pharmacist", wilaya="Constantine"),
        )
        ph_user1.set_password("demo1234")
        ph_user1.save()

        ph_user2, _ = User.objects.get_or_create(
            phone="+213555000003",
            defaults=dict(name="Dr. Youcef Hadj", role="pharmacist", wilaya="Constantine"),
        )
        ph_user2.set_password("demo1234")
        ph_user2.save()

        self.stdout.write(self.style.SUCCESS("  3 demo users ready."))

        # ── Pharmacies ────────────────────────────────────────────────────────
        self.stdout.write("Creating pharmacies…")

        pharmacy_data = [
            dict(
                name="Pharmacie El Amel",
                address="Rue Larbi Ben M'hidi, Constantine",
                wilaya="Constantine",
                lat=36.3650, lng=6.6147,
                phone="+213331234560",
                hours="08:00–20:00",
                is_verified=True,
                pharmacist=ph_user1,
            ),
            dict(
                name="Pharmacie Ibn Sina",
                address="Boulevard de l'Indépendance, Constantine",
                wilaya="Constantine",
                lat=36.3701, lng=6.6183,
                phone="+213331234561",
                hours="08:00–21:00",
                is_verified=True,
                pharmacist=ph_user2,
            ),
            dict(
                name="Pharmacie Centrale",
                address="Place des Martyrs, Constantine",
                wilaya="Constantine",
                lat=36.3665, lng=6.6120,
                phone="+213331234562",
                hours="07:30–20:30",
                is_verified=True,
                pharmacist=None,
            ),
            dict(
                name="Pharmacie El Nour",
                address="Cité Boussouf, Constantine",
                wilaya="Constantine",
                lat=36.3780, lng=6.5980,
                phone="+213331234563",
                hours="08:00–20:00",
                is_verified=False,
                pharmacist=None,
            ),
            dict(
                name="Pharmacie Sidi Mabrouk",
                address="Rue Didouche Mourad, Sidi Mabrouk, Constantine",
                wilaya="Constantine",
                lat=36.3730, lng=6.6350,
                phone="+213331234564",
                hours="08:00–19:00",
                is_verified=True,
                pharmacist=None,
            ),
            dict(
                name="Pharmacie El Wifak",
                address="Cité Ali Mendjeli, UV 10, Constantine",
                wilaya="Constantine",
                lat=36.3220, lng=6.5750,
                phone="+213331234565",
                hours="08:00–21:00",
                is_verified=True,
                pharmacist=None,
            ),
            dict(
                name="Pharmacie Nouvelle Ville",
                address="Cité Ali Mendjeli, UV 5, Constantine",
                wilaya="Constantine",
                lat=36.3180, lng=6.5700,
                phone="+213331234566",
                hours="08:30–20:00",
                is_verified=False,
                pharmacist=None,
            ),
            dict(
                name="Pharmacie El Khier",
                address="Rue Zighoud Youcef, El Khroub, Constantine",
                wilaya="Constantine",
                lat=36.2660, lng=6.6900,
                phone="+213331234567",
                hours="08:00–20:00",
                is_verified=True,
                pharmacist=None,
            ),
            dict(
                name="Pharmacie El Fath",
                address="Rue 19 Mars, Hamma Bouziane, Constantine",
                wilaya="Constantine",
                lat=36.4090, lng=6.5810,
                phone="+213331234568",
                hours="08:00–19:30",
                is_verified=False,
                pharmacist=None,
            ),
            dict(
                name="Pharmacie Zouaghi",
                address="Cité Zouaghi Slimane, Constantine",
                wilaya="Constantine",
                lat=36.3890, lng=6.5950,
                phone="+213331234569",
                hours="08:00–20:30",
                is_verified=True,
                pharmacist=None,
            ),
            dict(
                name="Pharmacie El Badr",
                address="Route de Batna, El Khroub, Constantine",
                wilaya="Constantine",
                lat=36.2520, lng=6.7080,
                phone="+213331234570",
                hours="08:00–20:00",
                is_verified=False,
                pharmacist=None,
            ),
            dict(
                name="Pharmacie Djebel El Ouahch",
                address="Djebel El Ouahch, Constantine",
                wilaya="Constantine",
                lat=36.4200, lng=6.6300,
                phone="+213331234571",
                hours="08:30–20:30",
                is_verified=True,
                pharmacist=None,
            ),
        ]

        pharmacies = []
        for data in pharmacy_data:
            pharmacist_user = data.pop("pharmacist")
            ph, _ = Pharmacy.objects.get_or_create(
                name=data["name"],
                defaults={**data, "pharmacist": pharmacist_user},
            )
            pharmacies.append(ph)

        self.stdout.write(self.style.SUCCESS(f"  {len(pharmacies)} pharmacies ready."))

        # ── Medicines ─────────────────────────────────────────────────────────
        self.stdout.write("Creating medicines…")

        # Each tuple: (inn, commercial_name, form, dosage)
        molecule_specs = [
            ("Metformine", "Metformine DCI", "Comprimé", "850 mg"),
            ("Amlodipine", "Amlodipine DCI", "Comprimé", "5 mg"),
            ("Atorvastatine", "Atorvastatine DCI", "Comprimé", "20 mg"),
            ("Losartan", "Losartan DCI", "Comprimé", "50 mg"),
            ("Oméprazole", "Oméprazole DCI", "Gélule", "20 mg"),
            ("Amoxicilline", "Amoxicilline DCI", "Gélule", "500 mg"),
            ("Paracétamol", "Paracétamol DCI", "Comprimé", "1000 mg"),
            ("Ibuprofène", "Ibuprofène DCI", "Comprimé", "400 mg"),
            ("Lévothyroxine", "Lévothyroxine DCI", "Comprimé", "50 mcg"),
            ("Acide acétylsalicylique", "AAS DCI", "Comprimé", "100 mg"),
            ("Amoxicilline + Clavulanate", "Co-Amoxiclav DCI", "Comprimé", "875/125 mg"),
            ("Salbutamol", "Salbutamol DCI", "Aérosol", "100 mcg/dose"),
        ]

        brand_specs = [
            # (inn, commercial_name, form, dosage)
            ("Metformine", "Glucophage", "Comprimé", "850 mg"),
            ("Metformine", "Metforal", "Comprimé", "500 mg"),
            ("Metformine", "Stagid", "Comprimé", "700 mg"),
            ("Amlodipine", "Amlor", "Comprimé", "5 mg"),
            ("Amlodipine", "Amlodin", "Comprimé", "10 mg"),
            ("Atorvastatine", "Tahor", "Comprimé", "40 mg"),
            ("Atorvastatine", "Lipitor", "Comprimé", "20 mg"),
            ("Losartan", "Cozaar", "Comprimé", "50 mg"),
            ("Losartan", "Lortan", "Comprimé", "100 mg"),
            ("Oméprazole", "Mopral", "Gélule", "20 mg"),
            ("Oméprazole", "Ogast", "Gélule", "20 mg"),
            ("Amoxicilline", "Clamoxyl", "Gélule", "500 mg"),
            ("Amoxicilline", "Amoxil", "Gélule", "1 g"),
            ("Paracétamol", "Doliprane", "Comprimé", "1000 mg"),
            ("Paracétamol", "Efferalgan", "Comprimé effervescent", "500 mg"),
            ("Paracétamol", "Dafalgan", "Comprimé", "1000 mg"),
            ("Ibuprofène", "Advil", "Comprimé", "400 mg"),
            ("Ibuprofène", "Brufen", "Comprimé", "600 mg"),
            ("Lévothyroxine", "Levothyrox", "Comprimé", "50 mcg"),
            ("Lévothyroxine", "Euthyrox", "Comprimé", "100 mcg"),
            ("Acide acétylsalicylique", "Aspégic", "Sachet", "100 mg"),
            ("Acide acétylsalicylique", "Kardégic", "Sachet", "75 mg"),
            ("Amoxicilline + Clavulanate", "Augmentin", "Comprimé", "875/125 mg"),
            ("Amoxicilline + Clavulanate", "Ciblor", "Comprimé", "500/125 mg"),
            ("Salbutamol", "Ventoline", "Aérosol", "100 mcg/dose"),
            ("Salbutamol", "Salbu", "Aérosol", "100 mcg/dose"),
        ]

        # Create canonical molecules (no parent)
        molecules = {}
        for inn, commercial_name, form, dosage in molecule_specs:
            mol, _ = Medicine.objects.get_or_create(
                inn=inn, commercial_name=commercial_name,
                defaults=dict(form=form, dosage=dosage, molecule=None),
            )
            molecules[inn] = mol

        # Create branded entries pointing to the molecule
        all_medicines = list(molecules.values())
        for inn, commercial_name, form, dosage in brand_specs:
            parent = molecules.get(inn)
            brand, _ = Medicine.objects.get_or_create(
                inn=inn, commercial_name=commercial_name,
                defaults=dict(form=form, dosage=dosage, molecule=parent),
            )
            all_medicines.append(brand)

        self.stdout.write(self.style.SUCCESS(f"  {len(all_medicines)} medicine entries ready."))

        # ── Availability Reports ───────────────────────────────────────────────
        self.stdout.write("Creating availability reports…")

        now = timezone.now()
        report_fixtures = [
            # (pharmacy_idx, medicine_commercial_name, status, confidence, hours_ago)
            (0, "Glucophage", "found", "high", 2),
            (0, "Metforal", "found", "high", 1),
            (0, "Amlor", "found", "high", 3),
            (0, "Tahor", "found", "medium", 5),
            (0, "Doliprane", "found", "high", 1),
            (1, "Glucophage", "found", "high", 4),
            (1, "Metforal", "not_found", "low", 6),
            (1, "Levothyrox", "found", "medium", 2),
            (1, "Augmentin", "found", "high", 1),
            (1, "Ventoline", "found", "high", 3),
            (2, "Stagid", "found", "medium", 8),
            (2, "Lipitor", "found", "high", 2),
            (2, "Cozaar", "found", "medium", 4),
            (2, "Mopral", "found", "high", 1),
            (2, "Clamoxyl", "found", "high", 2),
            (3, "Amlodin", "found", "low", 12),
            (3, "Lortan", "not_found", "medium", 10),
            (3, "Euthyrox", "found", "medium", 5),
            (4, "Glucophage", "not_found", "high", 1),
            (4, "Advil", "found", "high", 2),
            (4, "Efferalgan", "found", "high", 1),
            (4, "Aspégic", "found", "high", 3),
            (5, "Glucophage", "found", "medium", 6),
            (5, "Amlor", "found", "high", 2),
            (5, "Augmentin", "found", "high", 1),
            (5, "Ventoline", "found", "medium", 4),
            (6, "Metforal", "found", "low", 18),
            (6, "Tahor", "not_found", "low", 14),
            (7, "Doliprane", "found", "high", 1),
            (7, "Brufen", "found", "high", 2),
            (7, "Ciblor", "found", "medium", 5),
            (8, "Levothyrox", "found", "medium", 7),
            (8, "Kardégic", "found", "high", 3),
            (9, "Glucophage", "found", "high", 2),
            (9, "Cozaar", "found", "medium", 4),
            (10, "Salbu", "found", "medium", 9),
            (10, "Ogast", "found", "high", 3),
            (11, "Dafalgan", "found", "high", 1),
            (11, "Amlodin", "found", "medium", 5),
        ]

        # Map commercial name → medicine object
        med_by_name = {m.commercial_name: m for m in all_medicines}
        reports_created = 0
        for ph_idx, med_name, status, confidence, hours_ago in report_fixtures:
            med = med_by_name.get(med_name)
            ph = pharmacies[ph_idx]
            if not med:
                continue
            reported_at = now - timedelta(hours=hours_ago)
            expires_at = reported_at + timedelta(hours=48)
            AvailabilityReport.objects.get_or_create(
                pharmacy=ph, medicine=med, reporter=patient,
                defaults=dict(
                    status=status,
                    confidence=confidence,
                    expires_at=expires_at,
                ),
            )
            reports_created += 1

        self.stdout.write(self.style.SUCCESS(f"  {reports_created} availability reports ready."))

        # ── Parapharmaceutical Products ────────────────────────────────────────
        self.stdout.write("Creating parapharmaceutical products…")

        product_fixtures = [
            # (pharmacy_idx, name, brand, category, price_dzd, wholesale_dzd, stock_level, is_b2b)
            # ── Dermo-cosmetics ────────────────────────────────────────────────
            (0, "Cicalfate+ Crème Réparatrice Protectrice", "Avène", "dermo_cosmetics", 2800, 2200, "high", False),
            (0, "Anthelios XL SPF50+ Fluide", "La Roche-Posay", "dermo_cosmetics", 3200, None, "high", False),
            (1, "Sensibio H2O Eau Micellaire", "Bioderma", "dermo_cosmetics", 1900, 1500, "high", True),
            (1, "Cicaplast Baume B5", "La Roche-Posay", "dermo_cosmetics", 2500, None, "medium", False),
            (2, "Toleriane Sensitive Fluide", "La Roche-Posay", "dermo_cosmetics", 2700, None, "medium", False),
            (2, "ISDIN Fotoprotector Fusion Water SPF50", "ISDIN", "dermo_cosmetics", 3500, 2800, "low", True),
            (3, "Créme Hydratante Apaisante", "Avène", "dermo_cosmetics", 2100, None, "high", False),
            (5, "Sensibio Light Crème", "Bioderma", "dermo_cosmetics", 2200, 1800, "medium", True),
            (6, "Anthelios Invisible Spray SPF50+", "La Roche-Posay", "dermo_cosmetics", 3400, None, "high", False),
            (9, "Micellar Solution 3-in-1", "Garnier", "dermo_cosmetics", 1200, 900, "high", True),
            # ── Baby care ──────────────────────────────────────────────────────
            (0, "Hydra Bébé Lait Corps", "Mustela", "baby_care", 1800, 1400, "high", False),
            (1, "Crème Pommade de Soin", "Bepanthen", "baby_care", 1500, None, "high", False),
            (2, "Baby Moments Gel Douche", "Chicco", "baby_care", 1200, 950, "medium", True),
            (3, "Spray Nasal Physiologique Bébé", "Physiomer", "baby_care", 950, None, "high", False),
            (4, "Lait de Toilette 1–6 mois", "Mustela", "baby_care", 1900, 1500, "high", True),
            (5, "Crème Change Bébé 1–2–3", "Mustela", "baby_care", 1700, None, "medium", False),
            (7, "Baume Pêche Bébé", "Weleda", "baby_care", 2100, 1700, "low", True),
            (10, "Baby Bio Shampooing Doux", "Bioderma", "baby_care", 1600, 1200, "medium", True),
            # ── Supplements ───────────────────────────────────────────────────
            (0, "Oméga-3 1000 mg", "Solgar", "supplements", 4500, 3800, "medium", True),
            (1, "Bisglycinate de Magnésium 100 mg", "Pileje", "supplements", 2800, None, "high", False),
            (2, "Vitamine D3 4000 UI", "Pharmalp", "supplements", 1900, 1500, "high", True),
            (3, "Bion 3 Adultes", "Bion", "supplements", 3200, 2600, "medium", True),
            (4, "Zinc + Vitamine C Effervescent", "Alvityl", "supplements", 1100, None, "high", False),
            (5, "Complexe Multivitamines Femme", "Eviol", "supplements", 2500, 2000, "low", True),
            (6, "Vitamine B12 1000 mcg", "Solgar", "supplements", 3800, 3100, "medium", True),
            (8, "Fer + Acide Folique", "Tardyferon", "supplements", 1400, None, "high", False),
            (9, "Coenzyme Q10 100 mg", "Bioglan", "supplements", 5200, 4400, "low", True),
            (11, "Probiotiques Lactobacillus", "Pileje", "supplements", 3600, 2900, "medium", True),
            # ── Orthopedics ────────────────────────────────────────────────────
            (0, "Genouillère de maintien", "Futuro", "orthopedics", 4200, None, "medium", False),
            (1, "Chevillière de Contention", "Thuasne", "orthopedics", 3800, 3100, "low", True),
            (2, "Poignet Articulé Rigide", "Donjoy", "orthopedics", 7500, 6200, "low", True),
            (5, "Semelles Orthopédiques", "Scholl", "orthopedics", 2200, None, "high", False),
            (7, "Ceinture Lombaire", "Thuasne", "orthopedics", 5500, 4500, "medium", True),
            (9, "Épicondylite Band", "Futuro", "orthopedics", 3200, 2600, "low", True),
            # ── Wound care ─────────────────────────────────────────────────────
            (0, "Solution Dermique 10%", "Betadine", "wound_care", 480, None, "high", False),
            (1, "Pansement Adhésif Transparent", "Mepore", "wound_care", 850, 680, "high", True),
            (2, "Ampoules Anti-Ampoules", "Compeed", "wound_care", 1100, None, "high", False),
            (3, "Bande de Contention Élastique", "Velpeau", "wound_care", 620, 500, "high", True),
            (4, "Tulle Gras Stérile", "Jelonet", "wound_care", 390, None, "high", False),
            (6, "Spray Antiseptique Cutané", "Septivon", "wound_care", 720, None, "medium", False),
            (8, "Pansements Hydrocolloïdes", "Urgo", "wound_care", 1350, 1100, "medium", True),
            # ── Oral hygiene ───────────────────────────────────────────────────
            (0, "Dentifrice Sensibilité Pro-Relief", "Colgate", "oral_hygiene", 650, None, "high", False),
            (1, "Dentifrice Parodont Expert", "Meridol", "oral_hygiene", 780, None, "high", False),
            (2, "Bain de Bouche Cool Mint 250 ml", "Listerine", "oral_hygiene", 850, 680, "high", True),
            (3, "Brossettes Interdentaires", "TePe", "oral_hygiene", 480, None, "high", False),
            (5, "Dentifrice Blancheur Intense", "Signal", "oral_hygiene", 420, None, "high", False),
            (7, "Révélateur de Plaque Dentaire", "Gum", "oral_hygiene", 920, 740, "medium", True),
            (10, "Rince-Bouche Fluorinse", "Elmex", "oral_hygiene", 1100, None, "medium", False),
            # ── Hair care ──────────────────────────────────────────────────────
            (0, "Anaphase+ Shampooing Anti-Chute", "Ducray", "hair_care", 2100, None, "high", False),
            (1, "Shampooing Sec à l'Avoine", "Klorane", "hair_care", 1600, 1300, "medium", True),
            (2, "Dercos Shampooing Énergisant", "Vichy", "hair_care", 1900, None, "high", False),
            (3, "Elution Shampooing Équilibrant", "Ducray", "hair_care", 1700, 1350, "medium", True),
            (4, "Kelual DS Shampooing Traitant", "Ducray", "hair_care", 2300, None, "low", False),
            (6, "Masque Keratine Reconstituant", "Schwarzkopf", "hair_care", 1400, 1100, "high", True),
            (8, "Huile d'Argan 100% Pure", "Argania", "hair_care", 2800, 2200, "medium", True),
            (11, "Sérum Anti-Chute Intensif", "Vichy", "hair_care", 3200, None, "low", False),
            # ── Wellness devices ───────────────────────────────────────────────
            (0, "Tensiomètre Automatique M3", "Omron", "wellness_devices", 8500, 7000, "medium", True),
            (1, "Lecteur de Glycémie GL44", "Beurer", "wellness_devices", 5200, 4300, "medium", True),
            (2, "Thermomètre Infrarouge", "Microlife", "wellness_devices", 4800, 3900, "low", True),
            (3, "Nébuliseur à Maille Vibratoire", "Omron", "wellness_devices", 12000, 9800, "low", True),
            (5, "Tensiomètre Poignet RS7", "Microlife", "wellness_devices", 6500, 5400, "medium", True),
            (7, "Oxymètre de Pouls", "Beurer", "wellness_devices", 3800, 3100, "medium", True),
            (9, "Balance Connectée BMI", "Withings", "wellness_devices", 9500, None, "low", False),
            (11, "Stimulateur Musculaire TENS", "Beurer", "wellness_devices", 7200, 5900, "low", True),
        ]

        products_created = 0
        for ph_idx, name, brand, category, price, wholesale, stock, b2b in product_fixtures:
            ph = pharmacies[ph_idx]
            Product.objects.get_or_create(
                pharmacy=ph, name=name,
                defaults=dict(
                    brand=brand,
                    category=category,
                    price_dzd=price,
                    wholesale_price_dzd=wholesale,
                    stock_level=stock,
                    is_b2b_listed=b2b,
                ),
            )
            products_created += 1

        self.stdout.write(self.style.SUCCESS(f"  {products_created} products ready."))

        # ── Summary ────────────────────────────────────────────────────────────
        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS("Seed complete!"))
        self.stdout.write("")
        self.stdout.write("Demo accounts:")
        self.stdout.write("  Patient     +213555000001 / demo1234")
        self.stdout.write("  Pharmacist  +213555000002 / demo1234  (Pharmacie El Amel)")
        self.stdout.write("  Pharmacist  +213555000003 / demo1234  (Pharmacie Ibn Sina)")
