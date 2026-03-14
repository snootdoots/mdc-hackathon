#!/usr/bin/env node
/**
 * Test script to verify the parsing -> LLM -> JSON -> display flow
 * Run: node test_flow.js
 */

const fs = require('fs');
const path = require('path');
// Simple test using curl-like approach
const http = require('http');
const https = require('https');

const SERVER_URL = 'http://localhost:3000';
const TEST_FILE = path.join(__dirname, 'test_syllabus.txt');

async function testFlow() {
  console.log('🧪 Testing Syllabus Parsing Flow\n');
  console.log('=' .repeat(50));
  
  // Step 1: Check if server is running
  console.log('\n1️⃣ Checking if server is running...');
  try {
    const healthCheck = await fetch(SERVER_URL);
    if (healthCheck.ok) {
      console.log('✅ Server is running');
    } else {
      console.log('⚠️  Server responded but with status:', healthCheck.status);
    }
  } catch (error) {
    console.error('❌ Server is not running!');
    console.error('   Please start the server with:');
    console.error('   GEMINI_API_KEY=your_key npm start');
    process.exit(1);
  }
  
  // Step 2: Check if test file exists
  console.log('\n2️⃣ Checking test file...');
  if (!fs.existsSync(TEST_FILE)) {
    console.error('❌ Test file not found:', TEST_FILE);
    process.exit(1);
  }
  console.log('✅ Test file found');
  
  // Step 3: Test file upload and parsing
  console.log('\n3️⃣ Testing file upload and parsing...');
  try {
    const fileContent = fs.readFileSync(TEST_FILE);
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const fileName = 'CS280_Syllabus.txt';
    
    let body = '';
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n`;
    body += `Content-Type: text/plain\r\n\r\n`;
    body += fileContent.toString();
    body += `\r\n--${boundary}--\r\n`;
    
    console.log('   Uploading file...');
    const url = new URL(SERVER_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: '/api/parse-syllabus',
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(body)
      }
    };
    
    const response = await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({ status: res.statusCode, data });
        });
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    });
    
    if (response.status !== 200) {
      console.error('❌ API request failed:', response.status);
      console.error('   Error:', response.data);
      process.exit(1);
    }
    
    const result = JSON.parse(response.data);
    console.log('✅ API request successful!');
    console.log('\n📊 Results:');
    console.log('   - Success:', result.success);
    console.log('   - Parsed with:', result.parsedWith || 'unknown');
    console.log('   - Items found:', result.items?.length || 0);
    
    if (result.items && result.items.length > 0) {
      console.log('\n📝 Sample items:');
      result.items.slice(0, 3).forEach((item, i) => {
        console.log(`   ${i + 1}. Week ${item.week}: ${item.title} (${item.course})`);
        console.log(`      Subtasks: ${item.sub?.join(', ') || 'none'}`);
      });
      
      // Verify JSON structure
      console.log('\n4️⃣ Verifying JSON structure...');
      const requiredFields = ['week', 'course', 'title', 'sub', 'color'];
      const allValid = result.items.every(item => {
        return requiredFields.every(field => item.hasOwnProperty(field));
      });
      
      if (allValid) {
        console.log('✅ All items have required fields');
      } else {
        console.log('⚠️  Some items missing required fields');
      }
      
      // Check if LLM was used
      if (result.parsedWith === 'ai') {
        console.log('\n5️⃣ LLM Integration:');
        console.log('✅ AI parsing was used (Gemini API)');
        console.log('   Items have structured subtasks from LLM');
      } else {
        console.log('\n5️⃣ LLM Integration:');
        console.log('⚠️  Heuristic parsing was used (no LLM)');
        console.log('   Make sure GEMINI_API_KEY is set in environment');
      }
      
      console.log('\n' + '='.repeat(50));
      console.log('✅ Flow test completed successfully!');
      console.log('\nFlow Summary:');
      console.log('  1. File upload ✅');
      console.log('  2. Text extraction ✅');
      console.log(`  3. Parsing (${result.parsedWith}) ✅`);
      console.log('  4. JSON generation ✅');
      console.log('  5. Ready for frontend display ✅');
      
    } else {
      console.log('⚠️  No items were extracted from the syllabus');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('   Stack:', error.stack);
    process.exit(1);
  }
}

// Run test
testFlow().catch(console.error);

