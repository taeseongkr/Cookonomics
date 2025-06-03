import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../providers/user_data_provider.dart';
import '../widgets/user_input_form.dart';
import '../widgets/background_decoration.dart';
import '../widgets/floating_3d_elements.dart';
import '../widgets/nutrition_summary_card.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Background decoration with gradients and patterns
          const BackgroundDecoration(),
          
          // Floating 3D elements
          const Floating3DElements(),
          
          // Main content
          SafeArea(
            child: PageView(
              controller: _pageController,
              onPageChanged: (index) {
                setState(() {
                  _currentPage = index;
                });
              },
              children: [
                _buildWelcomePage(),
                _buildInputFormPage(),
                _buildSummaryPage(),
              ],
            ),
          ),
          
          // Bottom navigation dots
          Positioned(
            bottom: 30,
            left: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(3, (index) {
                return Container(
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  width: _currentPage == index ? 24 : 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: _currentPage == index 
                        ? Theme.of(context).colorScheme.primary
                        : Colors.white.withOpacity(0.5),
                    borderRadius: BorderRadius.circular(4),
                  ),
                );
              }),
            ).animate().fadeIn(duration: 800.ms),
          ),
        ],
      ),
    );
  }

  Widget _buildWelcomePage() {
    return Container(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Logo and title
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.9),
              borderRadius: BorderRadius.circular(30),
              boxShadow: [
                BoxShadow(
                  color: Theme.of(context).colorScheme.primary.withOpacity(0.2),
                  blurRadius: 20,
                  offset: const Offset(0, 10),
                ),
              ],
            ),
            child: Column(
              children: [
                Icon(
                  FontAwesomeIcons.seedling,
                  size: 80,
                  color: Theme.of(context).colorScheme.primary,
                ).animate().scale(
                  duration: 800.ms,
                  curve: Curves.elasticOut,
                ),
                const SizedBox(height: 20),
                Text(
                  'Cookonomics',
                  style: Theme.of(context).textTheme.headlineLarge,
                  textAlign: TextAlign.center,
                ).animate().fadeIn(delay: 300.ms),
                const SizedBox(height: 12),
                Text(
                  'Your Personal Nutrition & Recipe Assistant',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: Theme.of(context).colorScheme.primary,
                    fontWeight: FontWeight.w600,
                  ),
                  textAlign: TextAlign.center,
                ).animate().fadeIn(delay: 500.ms),
              ],
            ),
          ).animate().slideY(
            begin: 0.3,
            duration: 800.ms,
            curve: Curves.easeOutBack,
          ),
          
          const SizedBox(height: 40),
          
          // Features list
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.9),
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 15,
                  offset: const Offset(0, 5),
                ),
              ],
            ),
            child: Column(
              children: [
                _buildFeatureItem(
                  FontAwesomeIcons.chartLine,
                  'Personalized Nutrition',
                  'Get recipes tailored to your health goals',
                ),
                const SizedBox(height: 16),
                _buildFeatureItem(
                  FontAwesomeIcons.dollarSign,
                  'Budget-Friendly',
                  'Find healthy meals within your budget',
                ),
                const SizedBox(height: 16),
                _buildFeatureItem(
                  FontAwesomeIcons.shoppingCart,
                  'Smart Shopping',
                  'Generate shopping lists with nutritional value',
                ),
              ],
            ),
          ).animate().slideY(
            begin: 0.3,
            duration: 800.ms,
            delay: 200.ms,
            curve: Curves.easeOutBack,
          ),
          
          const SizedBox(height: 40),
          
          // Get started button
          ElevatedButton.icon(
            onPressed: () {
              _pageController.nextPage(
                duration: const Duration(milliseconds: 500),
                curve: Curves.easeInOut,
              );
            },
            icon: const Icon(FontAwesomeIcons.rocket),
            label: const Text('Get Started'),
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
            ),
          ).animate().scale(
            delay: 600.ms,
            duration: 600.ms,
            curve: Curves.elasticOut,
          ),
        ],
      ),
    );
  }

  Widget _buildInputFormPage() {
    return const SingleChildScrollView(
      padding: EdgeInsets.all(24),
      child: Column(
        children: [
          SizedBox(height: 20),
          Text(
            'Tell Us About Yourself',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 8),
          Text(
            'Help us create the perfect nutrition plan for you',
            style: TextStyle(
              fontSize: 16,
              color: Colors.white70,
            ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 30),
          UserInputForm(),
        ],
      ),
    );
  }

  Widget _buildSummaryPage() {
    return Consumer<UserDataProvider>(
      builder: (context, userData, child) {
        return SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const SizedBox(height: 20),
              Text(
                'Your Nutrition Profile',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  color: Colors.white,
                ),
                textAlign: TextAlign.center,
              ).animate().fadeIn(),
              const SizedBox(height: 30),
              const NutritionSummaryCard(),
              const SizedBox(height: 30),
              ElevatedButton.icon(
                onPressed: () {
                  // TODO: Navigate to recipe generation page
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Generating personalized recipes...'),
                      backgroundColor: Colors.green,
                    ),
                  );
                },
                icon: const Icon(FontAwesomeIcons.utensils),
                label: const Text('Generate Recipes'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                ),
              ).animate().scale(
                delay: 500.ms,
                duration: 600.ms,
                curve: Curves.elasticOut,
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildFeatureItem(IconData icon, String title, String description) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(
            icon,
            color: Theme.of(context).colorScheme.primary,
            size: 24,
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
              Text(
                description,
                style: Theme.of(context).textTheme.bodyMedium,
              ),
            ],
          ),
        ),
      ],
    );
  }
}
