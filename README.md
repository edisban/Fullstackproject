🟩 Authentication (JWT & Protected Routes)

Το σύστημα χρησιμοποιεί JWT για την ταυτοποίηση των χρηστών.
Το token αποθηκεύεται με ασφάλεια στο localStorage και εισάγεται αυτόματα σε όλα τα αιτήματα μέσω Axios interceptor.
Οι προστατευμένες διαδρομές ελέγχουν την αυθεντικότητα και κάνουν redirect σε μη εξουσιοδοτημένη πρόσβαση.

🟩 Axios API Layer

Κεντρικό Axios instance για όλα τα αιτήματα.
Διαχειρίζεται:

εισαγωγή JWT token

χειρισμό σφαλμάτων

αυτόματο logout σε 401

unified error messages

Έτσι αποφεύγεται ο επαναλαμβανόμενος κώδικας στα components.

🟩 Projects Module

Παρέχει CRUD λειτουργίες για projects:

δημιουργία

επεξεργασία

διαγραφή

εμφάνιση όλων των projects

empty state όταν δεν υπάρχουν δεδομένα

Κάθε project εμφανίζεται μέσω ProjectCard, ενώ το ProjectForm χειρίζεται όλες τις φόρμες εισαγωγής/επεξεργασίας.

🟩 Students Module

Διαχειρίζεται φοιτητές ανά project:

προσθήκη νέου φοιτητή

επεξεργασία

διαγραφή με επιβεβαίωση

αναζήτηση με όνομα ή ID

empty state όταν δεν υπάρχουν φοιτητές

Το StudentForm φροντίζει για validation, ενώ το StudentListItem προβάλλει κάθε φοιτητή ξεχωριστά.

🟩 Custom Hooks (State Management)

Υπάρχουν dedicated hooks για καθαρό και επαναχρησιμοποιήσιμο κώδικα:

• useProjects

Διαχειρίζεται όλη τη λογική των projects (fetch, create, update, delete).

• useStudents

Κεντρική λογική για φοιτητές, μαζί με validation, filtering και error handling.

• useSnackbar

Παγκόσμια διαχείριση ειδοποιήσεων (errors & success messages).

• useFetch

Γενικό εργαλείο για παντός τύπου API requests.

🟩 React Hook Form & Validation

Κάθε φόρμα διαθέτει:

required fields

pattern rules

real-time error feedback

αποτροπή αποστολής λανθασμένων δεδομένων

άμεση εμφάνιση errors κάτω από κάθε input

Η εφαρμογή εντοπίζει:

κενά πεδία

μη έγκυρο email

μη έγκυρο student ID

αλφαριθμητικούς περιορισμούς

μελλοντικές ημερομηνίες

🟩 Snackbar Notifications

Κεντρικός μηχανισμός ειδοποιήσεων:

εμφανίζει επιτυχίες & σφάλματα

auto dismiss

consistent UI

non-blocking (καλύτερο από alert)

Ενσωματωμένο σε όλα τα CRUD operations.

🟩 Error Handling System

Το σύστημα διαχειρίζεται:

backend errors (400, 401, 404, 500)

network errors

validation errors

constraint violations (unique student ID, duplicate project name)

fallback όσο αφορά απρόσμενα React errors μέσω ErrorBoundary

Όλα μεταφέρονται στο χρήστη με καθαρά, κατανοητά μηνύματα.

🟩 Routing Structure

Το React Router διαχειρίζεται:

login page

dashboard (projects)

students page ανά project

protected routes για authenticated users

Η πλοήγηση γίνεται προγραμματιστικά με useNavigate.

🟩 Material-UI & Theme

Χρησιμοποιείται custom dark theme:

consistent χρώματα

typography ρυθμισμένη για ευανάγνωστο UI

responsive layout

σύγχρονο design με hover states και animations

🟩 Accessibility

Η εφαρμογή τηρεί βασικές αρχές προσβασιμότητας:

ARIA labels

semantic HTML

keyboard navigation

screen reader-friendly components

σωστό focus management στα dialogs

🟩 Structure & Architecture

Το project είναι οργανωμένο σε:

components (UI)

hooks (logic)

pages (views)

api layer (network calls)

context (authentication)

utils (helper functions)

Έτσι διαχωρίζονται καθαρά η λογική, η κατάσταση και το UI.