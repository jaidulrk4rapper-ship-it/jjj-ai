import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:share_plus/share_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/ai_service.dart';

class SpeechToTextScreen extends StatefulWidget {
  const SpeechToTextScreen({super.key});

  @override
  State<SpeechToTextScreen> createState() => _SpeechToTextScreenState();
}

class _SpeechToTextScreenState extends State<SpeechToTextScreen> {
  final stt.SpeechToText _speech = stt.SpeechToText();
  final AiService _aiService = AiService();

  bool _isListening = false;
  String _text = "Tap mic & start speaking...";
  double _confidence = 1.0;
  bool _isAiLoading = false;
  String? _aiResponse;

  // history + language
  List<String> _history = [];
  bool _isLoadingHistory = true;
  String _selectedLang = 'auto'; // auto / hi-IN / bn-IN / en-US

  @override
  void initState() {
    super.initState();
    _loadHistory();
  }

  Future<void> _loadHistory() async {
    final prefs = await SharedPreferences.getInstance();
    final list = prefs.getStringList('stt_history') ?? [];
    setState(() {
      _history = list;
      _isLoadingHistory = false;
    });
  }

  Future<void> _saveHistory() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList('stt_history', _history);
  }

  Future<void> _saveCurrentText() async {
    final content = _text.trim();
    if (content.isEmpty || content == "Tap mic & start speaking...") {
      _showSnack("Kuch bolo pehle, phir save karenge 😄");
      return;
    }

    setState(() {
      // latest top pe
      _history.insert(0, content);
    });
    await _saveHistory();
    _showSnack("Text saved to history ✅");
  }

  void _showSnack(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(msg)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xff0A0E27),
      appBar: AppBar(
        title: const Text("JJJ AI – Speech to Text"),
        backgroundColor: Colors.black,
        actions: [
          IconButton(
            icon: const Icon(Icons.history),
            onPressed: _openHistory,
            tooltip: "View history",
          )
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // TEXT AREA
            Expanded(
              child: SingleChildScrollView(
                child: Text(
                  _text,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    height: 1.4,
                  ),
                ),
              ),
            ),

            // JJJ AI RESPONSE (agar available ho)
            if (_aiResponse != null) ...[
              const SizedBox(height: 12),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xff1A1F3A),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: const [
                        Icon(Icons.smart_toy, color: Colors.lightBlue, size: 20),
                        SizedBox(width: 8),
                        Text(
                          "JJJ AI Response",
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _aiResponse!,
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                        height: 1.4,
                      ),
                    ),
                  ],
                ),
              ),
            ],

            const SizedBox(height: 16),

            // LANGUAGE SELECT
            Row(
              children: [
                const Text(
                  "Language:",
                  style: TextStyle(color: Colors.grey),
                ),
                const SizedBox(width: 10),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xff1A1F3A),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: _selectedLang,
                      dropdownColor: const Color(0xff1A1F3A),
                      iconEnabledColor: Colors.white,
                      items: const [
                        DropdownMenuItem(
                          value: 'auto',
                          child: Text("Auto Detect",
                              style: TextStyle(color: Colors.white)),
                        ),
                        DropdownMenuItem(
                          value: 'hi-IN',
                          child: Text("Hindi (India)",
                              style: TextStyle(color: Colors.white)),
                        ),
                        DropdownMenuItem(
                          value: 'bn-IN',
                          child: Text("Bengali (India)",
                              style: TextStyle(color: Colors.white)),
                        ),
                        DropdownMenuItem(
                          value: 'en-US',
                          child: Text("English (US)",
                              style: TextStyle(color: Colors.white)),
                        ),
                      ],
                      onChanged: (val) {
                        if (val == null) return;
                        setState(() => _selectedLang = val);
                      },
                    ),
                  ),
                ),
                const Spacer(),
                Text(
                  "Accuracy: ${(_confidence * 100).toStringAsFixed(1)}%",
                  style: const TextStyle(color: Colors.grey),
                ),
              ],
            ),

            const SizedBox(height: 16),

            // ACTION BUTTONS
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _copyText,
                    icon: const Icon(Icons.copy, size: 18),
                    label: const Text("Copy"),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _shareText,
                    icon: const Icon(Icons.share, size: 18),
                    label: const Text("Share"),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _saveCurrentText,
                    icon: const Icon(Icons.bookmark, size: 18),
                    label: const Text("Save"),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 10),

            // JJJ AI button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: _isAiLoading ? null : _sendToAi,
                icon: _isAiLoading
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Icon(Icons.smart_toy),
                label: Text(
                  _isAiLoading ? "JJJ AI soch raha hai..." : "Ask JJJ AI",
                ),
              ),
            ),

            const SizedBox(height: 20),

            // MIC BUTTON
            GestureDetector(
              onTap: _listen,
              child: CircleAvatar(
                radius: 45,
                backgroundColor:
                    _isListening ? Colors.redAccent : Colors.lightBlue,
                child: const Icon(Icons.mic, size: 45, color: Colors.white),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              _isListening ? "Listening..." : "Tap mic to start",
              style: const TextStyle(color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }

  void _listen() async {
    if (!_isListening) {
      final available = await _speech.initialize(
        onStatus: (status) => debugPrint("STATUS: $status"),
        onError: (e) => debugPrint("ERROR: $e"),
      );

      if (available) {
        setState(() => _isListening = true);

        String? localeId;
        if (_selectedLang != 'auto') {
          localeId = _selectedLang;
        }

        _speech.listen(
          localeId: localeId,
          onResult: (result) {
            setState(() {
              _text = result.recognizedWords;
              _confidence = result.confidence == 0.0
                  ? 1.0
                  : result.confidence; // fallback
            });
          },
        );
      } else {
        _showSnack("Mic access nahi mila. Permission check karo.");
      }
    } else {
      setState(() => _isListening = false);
      _speech.stop();
    }
  }

  Future<void> _copyText() async {
    final content = _text.trim();
    if (content.isEmpty ||
        content == "Tap mic & start speaking..." ||
        content == "Tap mic to start") {
      _showSnack("Kuch text nahi mila copy karne ke liye.");
      return;
    }
    await Clipboard.setData(ClipboardData(text: content));
    _showSnack("Copied to clipboard ✅");
  }

  Future<void> _shareText() async {
    final content = _text.trim();
    if (content.isEmpty ||
        content == "Tap mic & start speaking..." ||
        content == "Tap mic to start") {
      _showSnack("Kuch text nahi mila share karne ke liye.");
      return;
    }
    await Share.share(content, subject: "JJJ AI – Transcribed text");
  }

  Future<void> _openHistory() async {
    if (_isLoadingHistory) {
      _showSnack("History loading hai...");
      return;
    }

    final selected = await Navigator.push<String>(
      context,
      MaterialPageRoute(
        builder: (_) => SttHistoryScreen(history: _history),
      ),
    );

    if (selected != null && selected.trim().isNotEmpty) {
      setState(() {
        _text = selected;
      });
      _showSnack("History text loaded.");
    }
  }

  Future<void> _sendToAi() async {
    final content = _text.trim();
    if (content.isEmpty ||
        content == "Tap mic & start speaking..." ||
        content == "Tap mic to start") {
      _showSnack("Pehle kuch bolo ya text type karo, phir JJJ AI se puchenge 😄");
      return;
    }

    setState(() {
      _isAiLoading = true;
      // Purana response rakho ya clear karna ho toh:
      // _aiResponse = null;
    });

    final reply = await _aiService.askJJJAI(content);

    setState(() {
      _isAiLoading = false;
      _aiResponse = reply;
    });
  }
}

class SttHistoryScreen extends StatelessWidget {
  final List<String> history;
  const SttHistoryScreen({super.key, required this.history});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xff0A0E27),
      appBar: AppBar(
        title: const Text("Transcription History"),
        backgroundColor: Colors.black,
      ),
      body: history.isEmpty
          ? const Center(
              child: Text(
                "No saved text yet.",
                style: TextStyle(color: Colors.grey),
              ),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: history.length,
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final text = history[index];
                return InkWell(
                  onTap: () {
                    Navigator.pop(context, text);
                  },
                  onLongPress: () {
                    showDialog(
                      context: context,
                      builder: (_) => AlertDialog(
                        backgroundColor: const Color(0xff1A1F3A),
                        title: const Text(
                          "Full Text",
                          style: TextStyle(color: Colors.white),
                        ),
                        content: SingleChildScrollView(
                          child: Text(
                            text,
                            style: const TextStyle(color: Colors.white),
                          ),
                        ),
                        actions: [
                          TextButton(
                            onPressed: () {
                              Navigator.pop(context);
                            },
                            child: const Text("Close"),
                          ),
                        ],
                      ),
                    );
                  },
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xff1A1F3A),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      text.length > 120 ? "${text.substring(0, 120)}..." : text,
                      style: const TextStyle(color: Colors.white),
                    ),
                  ),
                );
              },
            ),
    );
  }
}
