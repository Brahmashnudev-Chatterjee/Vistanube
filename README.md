# Vistanube
## A Scalable Cloud-Native Media Sharing Platform

-- For Backend Starting
cd backend
"C:\Program Files\Python312\python.exe" -m venv venv
venv\Scripts\activate
pip install -r requirement.txt
python app.py

-- For Frontend Starting
cd frontend\vistanube-frontend
npm install
npm install axios react-router-dom
npm run dev


-- Draft
Application Functional Design and User Interaction Model

The proposed solution is a scalable, cloud-native media sharing web application that supports two distinct user roles: Creators and Consumers. The system is designed to enforce strict role separation, controlled access to features, and a consistent user experience, while maintaining scalability, security, and data integrity in a cloud environment.

The application begins with a unified signup interface that allows users to register either as a Creator or a Consumer using a radio button selection. During registration, the system enforces global username uniqueness across both roles. A username registered as a Creator cannot be reused for Consumer registration and vice versa. This prevents identity conflicts and ensures accurate role-based access control during authentication and subsequent interactions.

Following registration, users authenticate through a common login interface. Upon successful login, the backend determines the role associated with the username and redirects the user to the appropriate dashboard. Creator accounts are routed to the Creator dashboard, while Consumer accounts are directed to the Consumer interface. This role-based redirection is enforced at the backend to prevent unauthorised access or role switching.

The Creator dashboard provides exclusive access to content management functionality. Creators can upload media in the form of images or videos, each accompanied by metadata including a title, caption, and upload timestamp. Once published, creator posts immediately become visible in the Consumer feed. Creators retain full ownership of their content and can perform CRUD (Create, Read, Update, Delete) operations only on media they have personally uploaded. A dedicated post history section displays all content uploaded by the Creator in chronological order, allowing them to review, edit, or delete their posts while preventing modification of content created by others.

The Consumer interface is designed solely for content discovery and interaction. Consumers can browse and view posts from all Creators within the system. A search section is provided to enhance content discovery. Consumers can search posts using the exact title, keywords within the title, or the Creator’s username. When an exact title match is entered, only posts with that exact title are displayed in the feed. If keywords are provided, all posts containing matching keywords within their titles are shown. Searching by a Creator’s username returns all posts published by that specific Creator. Clearing the search input restores the Consumer feed to its default state, displaying all available posts.

Each post includes interactive like and dislike buttons with mutually exclusive state logic. Clicking the like button marks the post as liked, and clicking it again removes the like. If a post is already liked and the dislike button is selected, the like is removed and a dislike is registered. Clicking the dislike button again removes the dislike, returning the post to a neutral state. This ensures accurate interaction tracking and consistent reaction states.

Consumers can also engage through a commenting system. Each post features a comment section that initially displays a “No comments yet” message if no comments exist. Once the first comment is added, this placeholder is replaced by the comment list. Consumers may submit multiple comments on the same post, and all comments are displayed in chronological order. Consumers are permitted to delete only their own comments, with deletion safeguarded by a confirmation prompt asking, “Are you sure you want to delete your comment?”.

Overall, this design ensures clear separation of responsibilities, secure content ownership, enhanced content discovery, and intuitive user interaction, while remaining fully aligned with scalable cloud-native deployment principles.
