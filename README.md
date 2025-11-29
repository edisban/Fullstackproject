 CRUD Λειτουργίες

Η εφαρμογή παρέχει πλήρες CRUD για:
Projects
Create / Read / Update / Delete
Ημερομηνία έναρξης, περιγραφή, timestamps
Students
Create / Read / Update / Delete
Σύνδεση με project (One-to-Many)
Grade, status, role, κ.λπ.
Users


   Ασφάλεια & Authentication

JWT Authentication

Το API απαιτεί JWT token για όλα τα προστατευμένα endpoints
Token διάρκειας 24 ωρών
SHA-256 Password Hashing
Όλοι οι κωδικοί χρηστών αποθηκεύονται hashed 
Security Layer
Custom JwtAuthenticationFilter
Custom JwtTokenProvider
Spring Security configuration

   Αρχιτεκτονική

Η εφαρμογή ακολουθεί καθαρή και οργανωμένη δομή:
Controllers
Υλοποιούν τα REST endpoints:
AuthController
ProjectController
StudentController
Services
Εδώ βρίσκεται όλη η επιχειρησιακή λογική:
Validations
Εύρεση / δημιουργία resources
Διαχείριση students μέσα σε projects
Ρίψη exceptions
Έλεγχος ύπαρξης εγγραφών
Περιλαμβάνει και custom service για το login:
CustomUserDetailsService (Spring Security)

  Repositories
Υλοποίηση μέσω Spring Data JPA για πρόσβαση στη βάση:
ProjectRepository
StudentRepository
UserRepository

Entities

Αντιστοιχία με PostgreSQL πίνακες:
Project
Student
User
Με One-to-Many σχέση Project → Students.
DTOs (Data Transfer Objects)
Requests για project & student inputs
API Response wrapper
Login request για authentication
Exception Handling

Παγκόσμιος handler επιστρέφει JSON errors για:

Validation errors
Not found
Unauthorized
Conflict (duplicate student ID)
Expired JWT
CORS

Ρυθμισμένο για frontend (

 Αναζήτηση Φοιτητών

Η εφαρμογή υποστηρίζει exact match search για:

Student ID (code number)
Όνομα



