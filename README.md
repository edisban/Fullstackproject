📌 Project Manager – Frontend (React + TypeScript)
🧾 Περιγραφή

Το frontend αποτελεί το γραφικό περιβάλλον της εφαρμογής Project Manager, η οποία επιτρέπει τη διαχείριση έργων και φοιτητών σε πραγματικό χρόνο.
Η εφαρμογή βασίζεται σε React + TypeScript με σύγχρονη αρχιτεκτονική, Material-UI design system, custom hooks και καθαρό API layer.

Υποστηρίζει:

🔐 Αυθεντικοποίηση με JWT

📁 Πλήρη CRUD διαχείριση projects

👥 Πλήρη CRUD διαχείριση φοιτητών

🔍 Αναζήτηση

📝 Validation σε όλες τις φόρμες

🎨 Responsive dark theme

🎥 Demo



Demo Video (Loom)   ΛΕΙΤΟΥΡΓΙΕΣ : https://www.loom.com/share/1811989a4f01429786ffa7bc0aff5728
                    FRONTEND : https://www.loom.com/share/b80c3b3d52484153a7c02bd9c685b96e 
                    BACKEND : https://www.loom.com/share/3ba15628885243e7a4d4819d2ff219bf
                    + από αυτά που θα ήθελα να εφαρμόσω εΙναι σίγουρα το pagination και το role-based access control, sorting, Multi-language Support (i18n) και dark-light mode.

🛠️ Τεχνολογίες

• React 18
• TypeScript
• Vite
• Material-UI (MUI)
• React Router
• Axios
• React Hook Form
• Custom Hooks Architecture

🚀 Εγκατάσταση & Εκκίνηση

2️⃣ Εγκατάσταση εξαρτήσεων

• npm install

3️⃣ Εκκίνηση development server

• npm run dev
• Η εφαρμογή τρέχει στο: http://localhost:5176/

🔐 Authentication (JWT & Protected Routes)

Το σύστημα χρησιμοποιεί JWT για την ταυτοποίηση χρηστών.

• Το token αποθηκεύεται στο localStorage
• Ο Axios interceptor το εισάγει αυτόματα σε όλα τα requests
• Οι protected routes επιτρέπουν πρόσβαση μόνο σε logged-in χρήστες
• Σε 401 γίνεται αυτόματο logout & redirect στο login

🌐 Axios API Layer

Υπάρχει κεντρικό axios instance που χειρίζεται:

• εισαγωγή JWT token
• unified error messages
• αυτόματο logout σε 401
• network error detection

Έτσι αποφεύγεται ο επαναλαμβανόμενος κώδικας στα components.

📁 Projects Module

Το module διαχειρίζεται πλήρως τα projects:

• δημιουργία
• επεξεργασία
• διαγραφή
• εμφάνιση όλων των projects
• empty state όταν δεν υπάρχουν δεδομένα

Components:

• ProjectCard – παρουσίαση project
• ProjectForm – φόρμες δημιουργίας/επεξεργασίας
• ConfirmDialog – επιβεβαίωση διαγραφής

👥 Students Module

Διαχείριση φοιτητών ανά project:

• προσθήκη νέου φοιτητή
• επεξεργασία
• διαγραφή με επιβεβαίωση
• αναζήτηση με όνομα ή ID
• empty state σε άδειες λίστες

Components:

• StudentForm – validation & form logic
• StudentListItem
• StudentSearchBar

🧠 State Management – Custom Hooks

• useProjects
– fetch projects
– δημιουργία / επεξεργασία / διαγραφή
– auto-refresh μετά από κάθε ενέργεια

• useStudents
– CRUD φοιτητών
– αναζήτηση
– server-side error handling

• useSnackbar
– κεντρικό σύστημα ειδοποιήσεων

• useCrudOperator
– Ενιαίο hook για ασφαλείς και σταθερές CRUD ενέργειες

Πλεονεκτήματα:

καθαρή αρχιτεκτονική

επαναχρησιμοποίηση λογικής

components χωρίς περιττό κώδικα

📝 React Hook Form & Validation

Η εφαρμογή ενσωματώνει ισχυρό validation layer:

• required fields
• pattern rules
• real-time error feedback
• άμεση απόρριψη λανθασμένων δεδομένων
• μηνύματα λάθους κάτω από κάθε input

Εντοπίζει:

κενά πεδία

μη έγκυρο student ID

μη έγκυρους χαρακτήρες

μελλοντικές ημερομηνίες

🔔 Snackbar Notifications

Κεντρικός μηχανισμός ειδοποιήσεων:

• εμφανίζει επιτυχίες & σφάλματα
• auto-dismiss
• consistent UI
• non-blocking

Χρησιμοποιείται σε όλες τις CRUD λειτουργίες.

⚠️ Error Handling System

Η εφαρμογή διαχειρίζεται:

• backend errors (400, 401, 404, 409, 500)
• validation errors
• network errors
• constraint violations (duplicate project name, unique student ID)
• fallback UI μέσω ErrorBoundary

Όλα εμφανίζονται με καθαρά και κατανοητά μηνύματα.

🔀 Routing Structure

Το React Router διαχειρίζεται:

• Login page
• Dashboard (projects)
• Students page ανά project
• Protected routes για authenticated users

Η πλοήγηση γίνεται με useNavigate.

🎨 Material-UI & Theme

Χρησιμοποιείται custom dark theme:

• consistent χρώματα
• ευανάγνωστη typography
• responsive layout
• σύγχρονο design και hover states
• Skeleton Screens: Φιλική εμφάνιση πριν φορτωθεί το περιεχόμενο.

✨ Accessibility

Η εφαρμογή ακολουθεί βασικές αρχές προσβασιμότητας:

• ARIA labels
• semantic HTML
• keyboard navigation
• screen reader-friendly components
• σωστό focus management στα dialogs