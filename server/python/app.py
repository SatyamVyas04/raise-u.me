import logging
import os
import io
import json
from flask import Flask, request, jsonify, send_file, flash, redirect, url_for  # type: ignore
from flask_cors import CORS  # type: ignore
from PyPDF2 import PdfReader  # type: ignore
from dotenv import load_dotenv  # type: ignore
import google.generativeai as genai  # type: ignore
from langchain_core.prompts import PromptTemplate  # type: ignore
from fpdf import FPDF  # type: ignore
import traceback

import re
import wikipedia  # type: ignore
import requests  # type: ignore
from bs4 import BeautifulSoup  # type: ignore
from typing import Optional, List, Dict  # type: ignore

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Google Gemini AI configuration
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Flask app initialization
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.secret_key = 'supersecretkey'  # Required for flash messages


# PDF Reader Function with Error Handling
def get_pdf_reader(pdf_file):
    try:
        text = ''
        with io.BytesIO(pdf_file.read()) as file:
            reader = PdfReader(file)
            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                text += page.extract_text()
        if not text:
            raise ValueError("No text could be extracted from the PDF.")
        return text
    except Exception as e:
        logging.error(f"Error extracting text from PDF: {e}")
        raise

# Custom PDF class for resume formatting


class ResumePDF(FPDF):
    def header(self):
        pass

    def footer(self):
        pass

    def add_contact_info(self, name, email, phone):
        self.set_font('Arial', 'B', 16)
        self.cell(0, 10, name, ln=True, align='C')
        self.set_font('Arial', '', 12)
        self.cell(0, 10, f'''Email: {email} | Phone: {
                  phone}''', ln=True, align='C')
        self.ln(10)

    def section_title(self, title):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, title, ln=True)
        self.ln(4)

    def section_body(self, body):
        self.set_font('Arial', '', 11)
        self.multi_cell(0, 10, body)
        self.ln()

    def bullet_points(self, points):
        self.set_font('Arial', '', 11)
        for point in points.split('\n'):
            self.cell(5)  # Add indentation
            self.cell(0, 10, f"- {point}", ln=True)

# Function to generate formatted PDF resume from the AI-enhanced text


def create_pdf(resume_text, output_filename="enhanced_resume.pdf"):
    try:
        name = "John Doe"  # Extract from resume_text if needed
        email = "johndoe@email.com"  # Extract from resume_text if needed
        phone = "+123456789"  # Extract from resume_text if needed

        # Split into sections by double line breaks
        sections = resume_text.split("\n\n")

        pdf = ResumePDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()

        # Add contact information
        pdf.add_contact_info(name, email, phone)

        # Add each section in formatted style
        for section in sections:
            lines = section.split("\n")
            if len(lines) > 1:
                title = lines[0]
                body = "\n".join(lines[1:])
                pdf.section_title(title)
                pdf.section_body(body)

        # Save the PDF to a file
        pdf_output_path = os.path.join(os.getcwd(), output_filename)
        pdf.output(pdf_output_path)

        logging.info(f"PDF generated successfully: {pdf_output_path}")
        return pdf_output_path
    except Exception as e:
        logging.error(f"Error creating PDF: {e}")
        raise

# Enhanced resume generation endpoint


@app.route('/enhance_resume', methods=['POST'])
def enhance_resume():
    try:
        if 'resume' not in request.files or 'job_description' not in request.files:
            logging.warn("No resume or job description file provided")
            return jsonify({"error": "Please upload both a resume and a job description."}), 400

        resume_file = request.files['resume']
        jd_file = request.files['job_description']

        try:
            resume_text = get_pdf_reader(resume_file)
            jd_text = get_pdf_reader(jd_file)
        except Exception as e:
            logging.error(f"Error reading PDF files: {e}")
            return jsonify({"error": f"Failed to read PDF files. Error: {str(e)}"}), 500

        logging.info("PDF files read successfully.")

        prompt = PromptTemplate.from_template('''You need to act as a professional Resume Enhancer. 
                                                  Study the provided resume and enhance it based on the job description below.
                                                  Ensure that the resume is tailored specifically to match the job requirements.
                                                  Return the result in structured JSON format with sections like summary, skills, experience, etc.
                                                  - Job Description: {job_description}
                                                  - Resume: {resume}''')

        ask = prompt.format(job_description=jd_text, resume=resume_text)

        try:
            model = genai.GenerativeModel("gemini-pro")
            result = model.generate_content(ask)

            if not result.text:
                logging.error("AI model returned an empty response")
                return jsonify({"error": "AI model returned an empty response."}), 500

            # Log the raw response for debugging purposes
            logging.info(f"Raw AI response: {result.text}")

        except Exception as e:
            logging.error(f"Error calling AI model: {e}")
            return jsonify({"error": f"Failed to generate content from AI model. Error: {str(e)}"}), 500

        try:
            # Clean the response and attempt to parse it as JSON
            cleaned_response = result.text.strip()
            # Remove any leading or trailing non-JSON content
            json_start = cleaned_response.find('{')
            json_end = cleaned_response.rfind('}') + 1
            if json_start != -1 and json_end != -1:
                cleaned_response = cleaned_response[json_start:json_end]

            resume_json = json.loads(cleaned_response)

            logging.info("Parsed resume JSON successfully.")
            return jsonify(resume_json), 200

        except json.JSONDecodeError as e:
            logging.error(f"Error parsing AI response: {e}")
            logging.error(f"Cleaned AI response content: {cleaned_response}")

            # If JSON parsing fails, return the cleaned text response
            return jsonify({"error": "Failed to parse as JSON. Raw response:", "content": cleaned_response}), 500

    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

# Endpoint to build a resume from user details and job description


@app.route('/build_resume', methods=['POST'])
def build_resume():
    try:
        logging.info("Starting build_resume function")
        data = request.json
        logging.info(f"Received data: {data}")

        # Validate input data
        required_fields = ['name', 'email', 'phone', 'skills',
                           'experience', 'education', 'projects', 'job_description']
        for field in required_fields:
            if field not in data or not data[field]:
                logging.error(f"Missing or empty required field: {field}")
                return jsonify({"error": f"Missing or empty required field: {field}"}), 400

        # Create the input text directly without using PromptTemplate
        input_text = f"""Create a resume based on the following information:

USER DETAILS:
Name: {data['name']}
Email: {data['email']}
Phone: {data['phone']}
Skills: {data['skills']}
Experience: {data['experience']}
Education: {data['education']}
Projects: {data['projects']}

JOB DESCRIPTION:
{data['job_description']}

Please create a well-structured resume in JSON format with the following sections:
- summary
- contactInformation (name, email, phone)
- skills (languages, technologies, others)
- experience (title, company, startDate, endDate, description)
- education (degree, institution, location, startDate, endDate, gpa)
- projects (title, description, technologies, link)

All dates should be in YYYY-MM-DD or YYYY-MM format.
Return ONLY the JSON object, with no additional text."""

        try:
            logging.info("Calling AI model")
            model = genai.GenerativeModel("gemini-pro")
            result = model.generate_content(input_text)

            if not result.text:
                logging.error("AI model returned an empty response")
                return jsonify({"error": "AI model returned an empty response."}), 500

            logging.info(f"Raw AI response: {result.text}")

        except Exception as e:
            logging.error(f"Error calling AI model: {e}")
            logging.error(traceback.format_exc())
            return jsonify({"error": f"Failed to generate content from AI model. Error: {str(e)}"}), 500

        try:
            logging.info("Processing AI response")
            cleaned_response = result.text.strip()

            # Find the JSON object in the response
            json_start = cleaned_response.find('{')
            json_end = cleaned_response.rfind('}') + 1

            if json_start == -1 or json_end == -1:
                raise ValueError("No valid JSON object found in the response")

            cleaned_response = cleaned_response[json_start:json_end]
            logging.info(f"Extracted JSON: {cleaned_response}")

            resume_json = json.loads(cleaned_response)
            logging.info("Parsed resume JSON successfully.")

            return jsonify(resume_json), 200

        except json.JSONDecodeError as e:
            logging.error(f"Error parsing AI response: {e}")
            logging.error(f"Cleaned AI response content: {cleaned_response}")
            logging.error(traceback.format_exc())
            return jsonify({"error": "Failed to parse as JSON", "content": cleaned_response}), 500
        except ValueError as e:
            logging.error(f"Error in response structure: {e}")
            logging.error(traceback.format_exc())
            return jsonify({"error": f"Invalid response structure: {str(e)}", "content": cleaned_response}), 500

    except Exception as e:
        logging.error(f"Unexpected error in build_resume: {e}")
        logging.error(traceback.format_exc())
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


def get_wiki_image(page_title: str) -> Optional[str]:
    """
    Get the main image from a Wikipedia page's infobox.

    Args:
        page_title: The title of the Wikipedia page

    Returns:
        Optional[str]: URL of the image if found, None otherwise
    """
    try:
        page = wikipedia.page(page_title, auto_suggest=False)
        response = requests.get(page.url, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        # Try multiple approaches to find the image
        image = None
        # First try infobox
        infobox = soup.find('table', {'class': 'infobox'})
        if infobox:
            image = infobox.find('img')

        # If no image in infobox, try first image in article
        if not image:
            image = soup.find('img', {'class': 'biography'}) or soup.find(
                'img', {'class': 'thumbimage'})

        if image and 'src' in image.attrs:
            image_url = image['src']
            if not image_url.startswith('http'):
                image_url = f"https:{image_url}"
            return image_url

        return None

    except Exception as e:
        logger.error(f"Error fetching image for {page_title}: {str(e)}")
        return None


def extract_skills(text: str) -> List[str]:
    """
    Extract relevant skills and keywords from text.

    Args:
        text: The text to analyze

    Returns:
        List[str]: List of found skills
    """
    tech_keywords = {
        'technical': [
            'AI', 'artificial intelligence', 'machine learning', 'deep learning',
            'technology', 'computing', 'software', 'hardware', 'engineering',
            'programming', 'computer science', 'data science', 'cloud computing',
            'robotics', 'automation'
        ],
        'business': [
            'innovation', 'entrepreneurship', 'leadership', 'business strategy',
            'management', 'startup', 'venture capital', 'investment',
            'philanthropy', 'strategic planning', 'business development'
        ]
    }

    found_skills = set()
    text_lower = text.lower()

    for category, keywords in tech_keywords.items():
        for keyword in keywords:
            if keyword.lower() in text_lower:
                found_skills.add(keyword)

    return sorted(list(found_skills))


class LeaderNotFoundException(Exception):
    pass


class WikipediaFetchError(Exception):
    pass


def get_leader_info(name: str) -> Dict:
    """
    Fetch and compile information about a tech leader.

    Args:
        name: The leader's full name

    Returns:
        Dict: Leader information including summary, image, and skills

    Raises:
        WikipediaFetchError: If Wikipedia data cannot be fetched
    """
    try:
        # Use exact match to avoid disambiguation issues
        page = wikipedia.page(name, auto_suggest=False)

        # Get first 10000 chars for better skill extraction
        content_sample = page.content[:10000]

        return {
            'name': name,
            'summary': page.summary,
            'image': get_wiki_image(name),
            'skills': extract_skills(content_sample),
            'url': page.url
        }
    except wikipedia.exceptions.DisambiguationError as e:
        logger.error(f"Disambiguation error for {name}: {str(e)}")
        # Try to find the most relevant page from options
        for option in e.options:
            if re.search(r'\b(businessman|entrepreneur|executive|CEO)\b', option, re.IGNORECASE):
                try:
                    return get_leader_info(option)
                except:
                    continue
        raise WikipediaFetchError(
            f"Could not resolve disambiguation for {name}")
    except Exception as e:
        logger.error(f"Error fetching info for {name}: {str(e)}")
        raise WikipediaFetchError(f"Failed to fetch information for {name}")


@app.route('/api/leaders')
def get_leaders():
    """API endpoint to get information about all tech leaders."""
    leaders = [
        {'id': 'jensen-huang', 'name': 'Jensen Huang'},
        {'id': 'sam-altman', 'name': 'Sam Altman'},
        {'id': 'bill-gates', 'name': 'Bill Gates'},
    ]

    response_data = []
    for leader in leaders:
        try:
            info = get_leader_info(leader['name'])
            response_data.append({
                'id': leader['id'],
                **info
            })
        except WikipediaFetchError as e:
            logger.error(f"Failed to fetch leader data: {str(e)}")
            response_data.append({
                'id': leader['id'],
                'name': leader['name'],
                'summary': 'Information temporarily unavailable',
                'image': None,
                'skills': [],
                'error': str(e)
            })

    return jsonify(response_data)


@app.route('/api/leaders/<leader_id>')
def get_leader_details(leader_id: str):
    """API endpoint to get detailed information about a specific tech leader."""
    name_map = {
        'jensen-huang': 'Jensen Huang',
        'sam-altman': 'Sam Altman',
        'bill-gates': 'Bill Gates'
    }

    name = name_map.get(leader_id)
    if not name:
        return jsonify({'error': 'Leader not found'}), 404

    try:
        leader_info = get_leader_info(name)
        return jsonify({
            'id': leader_id,
            **leader_info
        })
    except WikipediaFetchError as e:
        return jsonify({
            'error': str(e),
            'details': 'Failed to fetch leader information'
        }), 500


if __name__ == "__main__":
    app.run(debug=True)
