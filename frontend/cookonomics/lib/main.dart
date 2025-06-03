import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'pages/home_page.dart';
import 'providers/user_data_provider.dart';
import 'theme/app_theme.dart';

void main() {
  runApp(const HealthyLifestyleApp());
}

class HealthyLifestyleApp extends StatelessWidget {
  const HealthyLifestyleApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => UserDataProvider()),
      ],
      child: MaterialApp(
        title: 'Cookonomics - Healthy Lifestyle',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        home: const HomePage(),
      ),
    );
  }
}
