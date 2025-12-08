import 'dart:convert';
import 'package:http/http.dart' as http;

/// JJJ AI main service
/// - Abhi demo mode pe kaam karega
/// - Jaise hi backend ready ho, [_endpoint] me URL daal dena
class AiService {
  // 🔧 TODO:
  // Firebase Function deploy karne ke baad yaha URL daalo:
  // Format: https://asia-south1-YOUR_PROJECT_ID.cloudfunctions.net/jjjAi
  // Example:
  // static const String _endpoint = "https://asia-south1-jjjai-12345.cloudfunctions.net/jjjAi";
  static const String _endpoint = "";

  // Optional: agar auth chaiye ho toh yaha token daalo
  static const String _apiKey = "";

  Future<String> askJJJAI(String text) async {
    final trimmed = text.trim();
    if (trimmed.isEmpty) {
      return "Koi text nahi mila. Pehle kuch bolo ya type karo 🙂";
    }

    // 👉 Demo mode: without backend bhi flow test kar sakte ho
    if (_endpoint.isEmpty) {
      // Yaha sirf placeholder logic hai, real AI nahi
      return "JJJ AI (demo):\n\n"
          "Tumne jo bola uska rough transcript yeh hai:\n"
          "“$trimmed”\n\n"
          "Backend connect hone ke baad yaha pe real AI reply aayega "
          "(summary, answer, action items, translation, etc.).";
    }

    // ✅ Real API call (jab endpoint add karoge)
    try {
      final uri = Uri.parse(_endpoint);

      final headers = <String, String>{
        'Content-Type': 'application/json',
      };

      if (_apiKey.isNotEmpty) {
        headers['Authorization'] = 'Bearer $_apiKey';
      }

      final body = jsonEncode({
        'text': trimmed,
        // optional: 'model': 'gpt-4.1-mini' ya 'gemini-1.5-flash' etc.
      });

      final response = await http.post(uri, headers: headers, body: body);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        // Yaha assume kar rahe: { "reply": "text..." }
        final reply = data['reply']?.toString();
        if (reply == null || reply.isEmpty) {
          return "JJJ AI ne khali answer diya 😅. Response body samajh nahi aaya.";
        }
        return reply;
      } else {
        return "JJJ AI backend error (${response.statusCode}). "
            "Thoda der baad try karo ya endpoint check karo.";
      }
    } catch (e) {
      return "JJJ AI ko call karte waqt error aaya: $e";
    }
  }
}

