import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class Floating3DElements extends StatelessWidget {
  const Floating3DElements({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Floating fruits and vegetables
        Positioned(
          top: 100,
          right: 30,
          child: _buildFloatingElement(
            FontAwesomeIcons.appleWhole,
            Colors.red.withOpacity(0.7),
            size: 32,
            animationDelay: 0,
          ),
        ),
        
        Positioned(
          top: 200,
          left: 40,
          child: _buildFloatingElement(
            FontAwesomeIcons.carrot,
            Colors.orange.withOpacity(0.7),
            size: 28,
            animationDelay: 1000,
          ),
        ),
        
        Positioned(
          top: 350,
          right: 60,
          child: _buildFloatingElement(
            FontAwesomeIcons.leaf,
            Colors.green.withOpacity(0.8),
            size: 24,
            animationDelay: 2000,
          ),
        ),
        
        Positioned(
          bottom: 300,
          left: 30,
          child: _buildFloatingElement(
            FontAwesomeIcons.fishFins,
            Colors.blue.withOpacity(0.7),
            size: 30,
            animationDelay: 500,
          ),
        ),
        
        Positioned(
          bottom: 150,
          right: 40,
          child: _buildFloatingElement(
            FontAwesomeIcons.cheese,
            Colors.yellow.withOpacity(0.7),
            size: 26,
            animationDelay: 1500,
          ),
        ),
        
        // Floating health icons
        Positioned(
          top: 250,
          left: MediaQuery.of(context).size.width * 0.7,
          child: _buildFloatingElement(
            FontAwesomeIcons.heartPulse,
            Colors.pink.withOpacity(0.6),
            size: 20,
            animationDelay: 3000,
          ),
        ),
        
        Positioned(
          bottom: 400,
          left: MediaQuery.of(context).size.width * 0.2,
          child: _buildFloatingElement(
            FontAwesomeIcons.dumbbell,
            Colors.purple.withOpacity(0.6),
            size: 22,
            animationDelay: 2500,
          ),
        ),
        
        // Floating sparkles for magical effect
        Positioned(
          top: 180,
          left: MediaQuery.of(context).size.width * 0.5,
          child: _buildSparkle(12, 0),
        ),
        
        Positioned(
          top: 320,
          left: MediaQuery.of(context).size.width * 0.3,
          child: _buildSparkle(8, 1000),
        ),
        
        Positioned(
          bottom: 250,
          left: MediaQuery.of(context).size.width * 0.6,
          child: _buildSparkle(10, 2000),
        ),
        
        Positioned(
          bottom: 180,
          left: MediaQuery.of(context).size.width * 0.8,
          child: _buildSparkle(14, 1500),
        ),
      ],
    );
  }

  Widget _buildFloatingElement(
    IconData icon,
    Color color,
    {double size = 24, int animationDelay = 0}
  ) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.9),
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.3),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Icon(
        icon,
        color: color,
        size: size,
      ),
    ).animate(onPlay: (controller) => controller.repeat())
        .moveY(
          begin: 0,
          end: -15,
          duration: (3000 + (animationDelay % 1000)).ms,
          delay: animationDelay.ms,
        )
        .then()
        .moveY(
          begin: -15,
          end: 0,
          duration: (3000 + (animationDelay % 1000)).ms,
        )
        .rotate(
          begin: 0,
          end: 0.1,
          duration: (4000 + (animationDelay % 1500)).ms,
          delay: animationDelay.ms,
        )
        .then()
        .rotate(
          begin: 0.1,
          end: -0.1,
          duration: (4000 + (animationDelay % 1500)).ms,
        )
        .then()
        .rotate(
          begin: -0.1,
          end: 0,
          duration: (4000 + (animationDelay % 1500)).ms,
        );
  }

  Widget _buildSparkle(double size, int animationDelay) {
    return Icon(
      FontAwesomeIcons.wandSparkles,
      color: Colors.white.withOpacity(0.8),
      size: size,
    ).animate(onPlay: (controller) => controller.repeat())
        .fadeIn(
          duration: 1500.ms,
          delay: animationDelay.ms,
        )
        .then()
        .fadeOut(
          duration: 1500.ms,
        )
        .scale(
          begin: const Offset(0.5, 0.5),
          end: const Offset(1.2, 1.2),
          duration: 3000.ms,
          delay: animationDelay.ms,
        )
        .then()
        .scale(
          begin: const Offset(1.2, 1.2),
          end: const Offset(0.5, 0.5),
          duration: 3000.ms,
        );
  }
}
