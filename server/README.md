📌 Project Manager – Backend (Spring Boot)
🧾 Περιγραφή

Το backend αποτελεί τη βάση της εφαρμογής Project Manager, παρέχοντας REST API για την αυθεντικοποίηση χρηστών και την πλήρη διαχείριση έργων και φοιτητών.
Υλοποιείται σε Spring Boot με καθαρή αρχιτεκτονική, modular σχεδιασμό και ασφαλή επικοινωνία μέσω JWT.

Υποστηρίζει:

🔐 Ασφαλή αυθεντικοποίηση με JWT

📁 CRUD λειτουργίες για Projects

👥 CRUD λειτουργίες για Students ανά project

🔍 Αναζήτηση φοιτητών βάσει ID ή ονόματος

🎯 Σαφή validation & structured error handling

🗄️ Πλήρη αντιστοίχιση με PostgreSQL schema

🛠️ Τεχνολογίες

• Java 22
• Spring Boot 3
• Spring Security (JWT)
• Spring Data JPA / Hibernate
• PostgreSQL
• Maven
• Lombok

🔧 CRUD Λειτουργίες
🟩 Projects – Create / Read / Update / Delete

To σύστημα υποστηρίζει:

• Δημιουργία project
• Προβολή όλων των projects
• Ενημέρωση στοιχείων
• Διαγραφή project με cascade delete στους φοιτητές
• Πεδία: όνομα, περιγραφή, ημερομηνία έναρξης, timestamps

🟩 Students – Create / Read / Update / Delete

Οι φοιτητές συνδέονται με projects μέσω σχέσης One-to-Many.

Υποστηρίζονται:

• Προσθήκη φοιτητή σε συγκεκριμένο project
• Ενημέρωση στοιχείων
• Διαγραφή φοιτητή
• Αναζήτηση βάσει student ID ή ονόματος
• Χειρισμός uniqueness στο student ID
• Πεδία: ονοματεπώνυμο, code number, birth, role, project.

🟩 Users

• Οι χρήστες ορίζονται χειροκίνητα
  στη βάση δεδομένων
• Hashing κωδικών με SHA-256
• Authentication-only flows για την εφαρμογή

🔐 Ασφάλεια & Authentication
🟩 JWT Authentication

Το API προστατεύει τα endpoints μέσω JWT tokens:

• Απαιτείται token για κάθε προστατευμένο endpoint
• Token διάρκειας 24 ωρών
• Token δημιουργείται στο login μέσω Spring Security
• Tokens υπογράφονται με μυστικό κλειδί στο backend

🟩 Password Security

• Όλοι οι κωδικοί αποθηκεύονται hashed (SHA-256)
• Δεν αποθηκεύονται ποτέ plain text
• Το hashing γίνεται στο authentication flow

🟩 Security Layer Components

• JwtAuthenticationFilter – αναλύει και επαληθεύει JWT tokens
• JwtTokenProvider – δημιουργία & επικύρωση tokens
• Spring Security Config – καθορίζει ποια endpoints απαιτούν authentication

🧱 Αρχιτεκτονική – Layered Structure

Το backend ακολουθεί καθαρό και οργανωμένο domain-driven design:

🟩 Controllers

Υλοποιούν τα REST endpoints και δέχονται validated requests.

• AuthController
• ProjectController
• StudentController

Κάθε controller:

• εκτελεί input validation
• καλεί το αντίστοιχο service
• επιστρέφει τυποποιημένο ApiResponse

🟩 Services

Εδώ βρίσκεται η επιχειρησιακή λογική:

• δημιουργία / ενημέρωση / διαγραφή resources
• έλεγχος ύπαρξης εγγραφών
• business validation
• χειρισμός φοιτητών μέσα σε projects
• αναζήτηση φοιτητών
• ρίψη exceptions όπου χρειάζεται

Περιλαμβάνεται και custom service για login:

• CustomUserDetailsService για Spring Security authentication

🟩 Repositories

Αξιοποιούν Spring Data JPA για πρόσβαση στη βάση:

• ProjectRepository
• StudentRepository
• UserRepository

Πλεονεκτήματα:

αυτόματη δημιουργία queries

pagination & sorting (αν χρειαστεί μελλοντικά)

διαχείριση relationships

🟩 Entities

Αντιστοιχούν σε PostgreSQL πίνακες:

• Project
• Student
• User

Σχέσεις:

One-to-Many → Project → Students

@ManyToOne annotation στους φοιτητές

🟩 DTOs (Data Transfer Objects)

Χρησιμοποιούνται για:

• είσοδο δεδομένων (requests)
• έξοδο δεδομένων (responses)
• αποφυγή leakage εσωτερικών entity objects

Περιλαμβάνουν:

ProjectRequest

StudentRequest

LoginRequest

ApiResponse wrapper

⚠️ Exception Handling – Global Strategy

Υπάρχει παγκόσμιος Exception Handler που επιστρέφει καθαρά, δομημένα errors:

Υποστηρίζονται:

• Validation errors
• Entity not found
• Unauthorized
• Conflict (π.χ. duplicate student ID)
• Expired JWT
• Generic server errors

Όλα τα σφάλματα επιστρέφουν JSON:
{
  "data": null,
  "message": "Detailed error",
  "validationErrors": {}
}

🔍 Αναζήτηση Φοιτητών

Το backend υποστηρίζει exact match search για:

• Student code number (ID)
• Όνομα (first/last name)

Ο μηχανισμός αναζήτησης είναι optimized μέσω custom JPA queries.

🌐 CORS

Το backend έχει ρυθμιστεί για ομαλή επικοινωνία με το frontend:

• επιτρεπόμενα origins
• επιτρεπόμενα HTTP methods
• exposure headers εάν χρειάζεται
• ασφαλής επικοινωνία JWT

🗄️ Database (PostgreSQL)

Η βάση δεδομένων αποτελείται από τρεις βασικούς πίνακες με σαφείς σχέσεις και constraints.

🟩 Projects

• id (PK)
• name (unique)
• description
• start_date
• created_at / updated_at

Constraints:
• Unique όνομα project
• Σχέση 1 project → πολλοί φοιτητές (One-to-Many)

🟩 Students

• id (PK)
• first_name
• last_name
• code_number (unique student ID)
• grade, status, role
• project_id (FK → projects.id)

Constraints:
• Unique code_number
• ON DELETE CASCADE όταν διαγράφεται project
• Κάθε student πρέπει να ανήκει σε project (foreign key)

🟩 Users (Authentication Only)

• id (PK)
• username (unique)
• password (SHA-256 hashed)
• role

Σημείωση:
• Δεν υπάρχουν CRUD endpoints για users
• Οι χρήστες εισάγονται χειροκίνητα και χρησιμοποιούνται μόνο για login / JWT authentication