
import { Course, Lesson } from '@/services/DatabaseService';

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to Programming',
    description: 'Learn the basics of programming with this comprehensive introduction course.',
    thumbnail: '/placeholder.svg',
    lessonsCount: 5,
    isDownloaded: false
  },
  {
    id: '2',
    title: 'Web Development Fundamentals',
    description: 'Master the core concepts of HTML, CSS, and JavaScript for web development.',
    thumbnail: '/placeholder.svg',
    lessonsCount: 4,
    isDownloaded: false
  },
  {
    id: '3',
    title: 'Data Structures & Algorithms',
    description: 'Explore essential data structures and algorithms for efficient problem-solving.',
    thumbnail: '/placeholder.svg',
    lessonsCount: 6,
    isDownloaded: false
  },
  {
    id: '4',
    title: 'Mobile App Development',
    description: 'Build cross-platform mobile applications with modern frameworks.',
    thumbnail: '/placeholder.svg',
    lessonsCount: 4,
    isDownloaded: false
  },
];

export const mockLessons: Lesson[] = [
  // Course 1: Introduction to Programming
  {
    id: '1-1',
    courseId: '1',
    title: 'What is Programming?',
    content: `
      <h1>What is Programming?</h1>
      <p>Programming is the process of creating a set of instructions that tell a computer how to perform a task. These instructions can be written in various programming languages, such as Python, JavaScript, or C++.</p>
      <h2>Key Concepts:</h2>
      <ul>
        <li>Programs are sets of instructions for computers</li>
        <li>Programming languages have specific syntax and rules</li>
        <li>Code must be precise and unambiguous</li>
        <li>Computers execute instructions literally</li>
      </ul>
      <p>In this course, we'll learn the fundamental concepts that apply to all programming languages, which will make it easier for you to learn any specific language in the future.</p>
    `,
    order: 1,
    isDownloaded: false
  },
  {
    id: '1-2',
    courseId: '1',
    title: 'Variables and Data Types',
    content: `
      <h1>Variables and Data Types</h1>
      <p>Variables are used to store information that can be referenced and manipulated in a program. They provide a way of labeling data with a descriptive name.</p>
      <h2>Common Data Types:</h2>
      <ul>
        <li><strong>Strings</strong>: Text values like "Hello World"</li>
        <li><strong>Numbers</strong>: Integer and floating-point values</li>
        <li><strong>Booleans</strong>: True or false values</li>
        <li><strong>Arrays/Lists</strong>: Collections of values</li>
      </ul>
      <p>Example of declaring variables in JavaScript:</p>
      <pre><code>let name = "John";
let age = 25;
let isStudent = true;
let hobbies = ["reading", "coding", "hiking"];</code></pre>
    `,
    order: 2,
    isDownloaded: false
  },
  {
    id: '1-3',
    courseId: '1',
    title: 'Control Flow: Conditionals',
    content: `
      <h1>Control Flow: Conditionals</h1>
      <p>Conditional statements allow your program to make decisions based on certain conditions. They help your program execute different actions based on different situations.</p>
      <h2>Common Conditional Structures:</h2>
      <ul>
        <li><strong>If statements</strong>: Execute code if a condition is true</li>
        <li><strong>If-else statements</strong>: Execute one block if condition is true, another if false</li>
        <li><strong>Switch statements</strong>: Select one of many code blocks to execute</li>
      </ul>
      <p>Example of if-else statement in Python:</p>
      <pre><code>temperature = 25

if temperature > 30:
    print("It's hot outside!")
elif temperature > 20:
    print("It's a nice day!")
else:
    print("It's cold outside!")</code></pre>
    `,
    order: 3,
    isDownloaded: false
  },
  {
    id: '1-4',
    courseId: '1',
    title: 'Loops and Iteration',
    content: `
      <h1>Loops and Iteration</h1>
      <p>Loops allow you to execute a block of code multiple times. They're essential for automating repetitive tasks and processing collections of data.</p>
      <h2>Common Loop Structures:</h2>
      <ul>
        <li><strong>For loops</strong>: Execute code a specific number of times</li>
        <li><strong>While loops</strong>: Execute code as long as a condition is true</li>
        <li><strong>For-each loops</strong>: Iterate over elements in a collection</li>
      </ul>
      <p>Example of a for loop in Java:</p>
      <pre><code>// Print numbers from 1 to 5
for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}</code></pre>
    `,
    order: 4,
    isDownloaded: false
  },
  {
    id: '1-5',
    courseId: '1',
    title: 'Functions and Methods',
    content: `
      <h1>Functions and Methods</h1>
      <p>Functions are reusable blocks of code designed to perform a specific task. They help organize code, make it reusable, and prevent repetition.</p>
      <h2>Key Function Concepts:</h2>
      <ul>
        <li><strong>Parameters</strong>: Values passed into functions</li>
        <li><strong>Return values</strong>: Output from functions</li>
        <li><strong>Scope</strong>: Where variables are accessible</li>
        <li><strong>Pure functions</strong>: Functions without side effects</li>
      </ul>
      <p>Example of a function in JavaScript:</p>
      <pre><code>function calculateArea(width, height) {
    return width * height;
}

let area = calculateArea(5, 10);
console.log(area); // Outputs: 50</code></pre>
    `,
    order: 5,
    isDownloaded: false
  },
  
  // Course 2: Web Development Fundamentals
  {
    id: '2-1',
    courseId: '2',
    title: 'HTML Basics',
    content: `
      <h1>HTML Basics</h1>
      <p>HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page using elements represented by tags.</p>
      <h2>Key HTML Concepts:</h2>
      <ul>
        <li><strong>Elements</strong>: Building blocks of HTML pages</li>
        <li><strong>Tags</strong>: Used to create elements</li>
        <li><strong>Attributes</strong>: Provide additional information about elements</li>
        <li><strong>Document structure</strong>: How elements are organized</li>
      </ul>
      <p>Example of basic HTML structure:</p>
      <pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;My First Web Page&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;Hello, World!&lt;/h1&gt;
    &lt;p&gt;This is a paragraph.&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
    `,
    order: 1,
    isDownloaded: false
  },
  {
    id: '2-2',
    courseId: '2',
    title: 'CSS Styling',
    content: `
      <h1>CSS Styling</h1>
      <p>CSS (Cascading Style Sheets) is used to style and layout web pages. It controls how HTML elements are displayed on screen, giving websites their visual appearance.</p>
      <h2>Key CSS Concepts:</h2>
      <ul>
        <li><strong>Selectors</strong>: Target HTML elements</li>
        <li><strong>Properties</strong>: Define what to style</li>
        <li><strong>Values</strong>: Specify how to style</li>
        <li><strong>Box model</strong>: How elements are displayed</li>
      </ul>
      <p>Example of CSS styling:</p>
      <pre><code>/* Style a paragraph */
p {
    color: blue;
    font-size: 16px;
    margin: 10px;
    padding: 5px;
    border: 1px solid gray;
}

/* Style a class */
.highlight {
    background-color: yellow;
    font-weight: bold;
}</code></pre>
    `,
    order: 2,
    isDownloaded: false
  },
  {
    id: '2-3',
    courseId: '2',
    title: 'JavaScript Fundamentals',
    content: `
      <h1>JavaScript Fundamentals</h1>
      <p>JavaScript is a programming language that adds interactivity to web pages. It allows you to create dynamic content, control multimedia, and update content without reloading the page.</p>
      <h2>Key JavaScript Concepts:</h2>
      <ul>
        <li><strong>Variables</strong>: Store and manage data</li>
        <li><strong>Functions</strong>: Reusable blocks of code</li>
        <li><strong>Events</strong>: Respond to user actions</li>
        <li><strong>DOM manipulation</strong>: Change HTML content</li>
      </ul>
      <p>Example of JavaScript interactivity:</p>
      <pre><code>// Select an element
const button = document.querySelector('#myButton');

// Add event listener
button.addEventListener('click', function() {
    // Change content
    document.querySelector('#output').textContent = 'Button was clicked!';
    
    // Change styles
    this.style.backgroundColor = 'red';
});</code></pre>
    `,
    order: 3,
    isDownloaded: false
  },
  {
    id: '2-4',
    courseId: '2',
    title: 'Responsive Web Design',
    content: `
      <h1>Responsive Web Design</h1>
      <p>Responsive web design is an approach that makes web pages look good on all devices and screen sizes. It involves flexible layouts, flexible images, and CSS media queries.</p>
      <h2>Key Responsive Design Concepts:</h2>
      <ul>
        <li><strong>Fluid grids</strong>: Use relative units like percentages</li>
        <li><strong>Flexible images</strong>: Scale with their containers</li>
        <li><strong>Media queries</strong>: Apply different styles based on device characteristics</li>
        <li><strong>Mobile-first design</strong>: Design for mobile first, then enhance for larger screens</li>
      </ul>
      <p>Example of responsive design with media queries:</p>
      <pre><code>/* Base styles for all screen sizes */
.container {
    width: 100%;
    padding: 15px;
}

/* Styles for tablets and larger */
@media (min-width: 768px) {
    .container {
        width: 750px;
        margin: 0 auto;
    }
}

/* Styles for desktops */
@media (min-width: 1024px) {
    .container {
        width: 970px;
    }
}</code></pre>
    `,
    order: 4,
    isDownloaded: false
  },
];
