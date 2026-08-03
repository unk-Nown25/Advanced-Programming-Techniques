/**
 * مثال على تعدد الأشكال (Polymorphism) في الجافا
 */
abstract class Shape {
    abstract void draw();
}

class Circle extends Shape {
    void draw() {
        System.out.println("رسم دائرة");
    }
}

class Square extends Shape {
    void draw() {
        System.out.println("رسم مربع");
    }
}

public class PolymorphismExample {
    public static void main(String[] args) {
        // استخدام تعدد الأشكال
        Shape[] shapes = {new Circle(), new Square()};
        
        for (Shape shape : shapes) {
            shape.draw(); // سيتم استدعاء الدالة المناسبة لكل كائن في وقت التشغيل
        }
    }
}
