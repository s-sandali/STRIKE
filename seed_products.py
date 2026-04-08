import os
import sys
from decimal import Decimal

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.session import SessionLocal
from app.models.product import Product

def seed():
    db = SessionLocal()
    
    # Empty existing rows
    db.query(Product).delete()
    
    products = [
        {
            "name": "Ankle Strap Heels",
            "price": Decimal("12900.00"),
            "old_price": Decimal("13500.00"),
            "rating": Decimal("4.3"),
            "reviews_count": 140,
            "description": "Discover the perfect blend of style, comfort, and durability with our latest shoe collection — designed for everyday wear, but crafted to make a statement. Whether you're navigating city streets, heading to the office, or catching up with friends, these shoes are your go-to companion for every step.Made with premium materials and breathable lining, each pair ensures all-day comfort without compromising on design. The lightweight sole offers superior flexibility and shock absorption, reducing foot fatigue and keeping you energized throughout your day. Reinforced stitching and quality craftsmanship provide long-lasting wear, so your shoes look fresh—season after season.From modern minimalism to bold street-inspired looks, our collection is thoughtfully created to suit a variety of personal styles. Slip them on and experience a perfect fit, versatile design, and the confidence to move through life in comfort and style.",
            "material": "Leather",
            "product_type": "Heels",
            "heel_type": "Block Heel",
            "available_sizes": "S, M, L, XL, XXL",
            "weight": "1.3 kg",
            "image_url": "https://i.pinimg.com/1200x/de/61/e3/de61e33fdd7a6e7f2c7bdef1f8ba9f20.jpg"
        },
        {
            "name": "Grvity  Ballet flats",
            "price": Decimal("12000.00"),
            "old_price": Decimal("15600.00"),
            "rating": Decimal("4.3"),
            "reviews_count": 89,
            "description": "Discover the perfect blend of style, comfort, and durability with our latest shoe collection — designed for everyday wear, but crafted to make a statement. Whether you're navigating city streets, heading to the office, or catching up with friends, these shoes are your go-to companion for every step.Made with premium materials and breathable lining, each pair ensures all-day comfort without compromising on design. The lightweight sole offers superior flexibility and shock absorption, reducing foot fatigue and keeping you energized throughout your day. Reinforced stitching and quality craftsmanship provide long-lasting wear, so your shoes look fresh—season after season.From modern minimalism to bold street-inspired looks, our collection is thoughtfully created to suit a variety of personal styles. Slip them on and experience a perfect fit, versatile design, and the confidence to move through life in comfort and style.",
            "material": "Leather",
            "product_type": "Ballet flats",
            "heel_type": "Flat Heel",
            "available_sizes": "S, M, L, XL, XXL",
            "weight": "1.5 kg",
            "image_url": "https://i.pinimg.com/736x/8f/37/d1/8f37d10529035f5ec5ba434f638a069d.jpg"
        },
        {
            "name": "Beach Sandals",
            "price": Decimal("7800.00"),
            "old_price": Decimal("9500.00"),
            "rating": Decimal("4.1"),
            "reviews_count": 56,
            "description": "Discover the perfect blend of style, comfort, and durability with our latest shoe collection — designed for everyday wear, but crafted to make a statement. Whether you're navigating city streets, heading to the office, or catching up with friends, these shoes are your go-to companion for every step.Made with premium materials and breathable lining, each pair ensures all-day comfort without compromising on design. The lightweight sole offers superior flexibility and shock absorption, reducing foot fatigue and keeping you energized throughout your day. Reinforced stitching and quality craftsmanship provide long-lasting wear, so your shoes look fresh—season after season.From modern minimalism to bold street-inspired looks, our collection is thoughtfully created to suit a variety of personal styles. Slip them on and experience a perfect fit, versatile design, and the confidence to move through life in comfort and style.",
            "material": "Leather",
            "product_type": "Beach Sandals",
            "heel_type": "Flat Heel",
            "available_sizes": "S, M, L, XL, XXL",
            "weight": "1.8 kg",
            "image_url": "https://i.pinimg.com/1200x/e2/9d/ea/e29deab3081beb86dcea595ae53f485e.jpg"
        },
        {
            "name": "Boltrek Sports Shoe",
            "price": Decimal("26000.00"),
            "old_price": Decimal("30000.00"),
            "rating": Decimal("4.3"),
            "reviews_count": 210,
            "description": "Discover the perfect blend of style, comfort, and durability with our latest shoe collection — designed for everyday wear, but crafted to make a statement. Whether you're navigating city streets, heading to the office, or catching up with friends, these shoes are your go-to companion for every step.Made with premium materials and breathable lining, each pair ensures all-day comfort without compromising on design. The lightweight sole offers superior flexibility and shock absorption, reducing foot fatigue and keeping you energized throughout your day. Reinforced stitching and quality craftsmanship provide long-lasting wear, so your shoes look fresh—season after season.From modern minimalism to bold street-inspired looks, our collection is thoughtfully created to suit a variety of personal styles. Slip them on and experience a perfect fit, versatile design, and the confidence to move through life in comfort and style.",
            "material": "Mesh/Synthetic",
            "product_type": "Sneakers",
            "heel_type": "Flat Heel",
            "available_sizes": "S, M, L, XL, XXL",
            "weight": "0.9 kg",
            "image_url": "https://i.pinimg.com/736x/a3/7f/67/a37f672d2450ea71b25f6c73c22044df.jpg"
        },
        {
            "name": "Maharaj flats",
            "price": Decimal("12900.00"),
            "old_price": Decimal("13200.00"),
            "rating": Decimal("4.1"),
            "reviews_count": 76,
            "description": "Discover the perfect blend of style, comfort, and durability with our latest shoe collection — designed for everyday wear, but crafted to make a statement. Whether you're navigating city streets, heading to the office, or catching up with friends, these shoes are your go-to companion for every step.Made with premium materials and breathable lining, each pair ensures all-day comfort without compromising on design. The lightweight sole offers superior flexibility and shock absorption, reducing foot fatigue and keeping you energized throughout your day. Reinforced stitching and quality craftsmanship provide long-lasting wear, so your shoes look fresh—season after season.From modern minimalism to bold street-inspired looks, our collection is thoughtfully created to suit a variety of personal styles. Slip them on and experience a perfect fit, versatile design, and the confidence to move through life in comfort and style.",
            "material": "Leather",
            "product_type": "Flats",
            "heel_type": "Flat Heel",
            "available_sizes": "S, M, L, XL, XXL",
            "weight": "1.4 kg",
            "image_url": "https://www.needledust.com/cdn/shop/files/DSC0088_4a1fa983-3fca-4baa-a298-6b0041adbf7c_600x600_crop_center.jpg?v=1754734196"
        },
        {
            "name": "Messhed Sandal",
            "price": Decimal("8500.00"),
            "old_price": Decimal("10400.00"),
            "rating": Decimal("4.2"),
            "reviews_count": 105,
            "description": "Discover the perfect blend of style, comfort, and durability with our latest shoe collection — designed for everyday wear, but crafted to make a statement. Whether you're navigating city streets, heading to the office, or catching up with friends, these shoes are your go-to companion for every step.Made with premium materials and breathable lining, each pair ensures all-day comfort without compromising on design. The lightweight sole offers superior flexibility and shock absorption, reducing foot fatigue and keeping you energized throughout your day. Reinforced stitching and quality craftsmanship provide long-lasting wear, so your shoes look fresh—season after season.From modern minimalism to bold street-inspired looks, our collection is thoughtfully created to suit a variety of personal styles. Slip them on and experience a perfect fit, versatile design, and the confidence to move through life in comfort and style.",
            "material": "Suede/Leather",
            "product_type": "Beach Sandal",
            "heel_type": "Flat Heel",
            "available_sizes": "S, M, L, XL, XXL",
            "weight": "1.3 kg",
            "image_url": "https://i.pinimg.com/1200x/33/68/0d/33680d826e32891d6e1f6a6c30c00289.jpg"
        },
        {
            "name": "Birkenstock Sandal",
            "price": Decimal("13800.00"),
            "old_price": Decimal("14400.00"),
            "rating": Decimal("4.4"),
            "reviews_count": 320,
            "description": "Discover the perfect blend of style, comfort, and durability with our latest shoe collection — designed for everyday wear, but crafted to make a statement. Whether you're navigating city streets, heading to the office, or catching up with friends, these shoes are your go-to companion for every step.Made with premium materials and breathable lining, each pair ensures all-day comfort without compromising on design. The lightweight sole offers superior flexibility and shock absorption, reducing foot fatigue and keeping you energized throughout your day. Reinforced stitching and quality craftsmanship provide long-lasting wear, so your shoes look fresh—season after season.From modern minimalism to bold street-inspired looks, our collection is thoughtfully created to suit a variety of personal styles. Slip them on and experience a perfect fit, versatile design, and the confidence to move through life in comfort and style.",
            "material": "Mesh",
            "product_type": "Loafers",
            "heel_type": "Flat Heel",
            "available_sizes": "S, M, L, XL, XXL",
            "weight": "0.8 kg",
            "image_url": "https://i.pinimg.com/736x/18/0a/49/180a490f428685c3c599d7a1ef8550ea.jpg"
        },
        {
            "name": "Eclipse Sneakers",
            "price": Decimal("29500.00"),
            "old_price": Decimal("32000.00"),
            "rating": Decimal("4.3"),
            "reviews_count": 210,
            "description": "Discover the perfect blend of style, comfort, and durability with our latest shoe collection — designed for everyday wear, but crafted to make a statement. Whether you're navigating city streets, heading to the office, or catching up with friends, these shoes are your go-to companion for every step.Made with premium materials and breathable lining, each pair ensures all-day comfort without compromising on design. The lightweight sole offers superior flexibility and shock absorption, reducing foot fatigue and keeping you energized throughout your day. Reinforced stitching and quality craftsmanship provide long-lasting wear, so your shoes look fresh—season after season.From modern minimalism to bold street-inspired looks, our collection is thoughtfully created to suit a variety of personal styles. Slip them on and experience a perfect fit, versatile design, and the confidence to move through life in comfort and style.",
            "material": "Mesh/Synthetic",
            "product_type": "Sneakers",
            "heel_type": "Flat Heel",
            "available_sizes": "S, M, L, XL, XXL",
            "weight": "0.9 kg",
            "image_url": "https://i.pinimg.com/736x/93/67/f8/9367f8ff6181f322823cac9d7ef6eb06.jpg"
        },
        {
            "name": "Orinzo Running Shoe",
            "price": Decimal("34500.00"),
            "old_price": Decimal("38000.00"),
            "rating": Decimal("4.1"),
            "reviews_count": 210,
            "description": "Discover the perfect blend of style, comfort, and durability with our latest shoe collection — designed for everyday wear, but crafted to make a statement. Whether you're navigating city streets, heading to the office, or catching up with friends, these shoes are your go-to companion for every step.Made with premium materials and breathable lining, each pair ensures all-day comfort without compromising on design. The lightweight sole offers superior flexibility and shock absorption, reducing foot fatigue and keeping you energized throughout your day. Reinforced stitching and quality craftsmanship provide long-lasting wear, so your shoes look fresh—season after season.From modern minimalism to bold street-inspired looks, our collection is thoughtfully created to suit a variety of personal styles. Slip them on and experience a perfect fit, versatile design, and the confidence to move through life in comfort and style.",
            "material": "Mesh/Synthetic",
            "product_type": "Sneakers",
            "heel_type": "Flat Heel",
            "available_sizes": "S, M, L, XL, XXL",
            "weight": "0.9 kg",
            "image_url": "https://i.pinimg.com/736x/e7/9f/fd/e79ffd26a184a1ce1e9a38b479917188.jpg"
        },
        {
            "name": "Cavora High Neck",
            "price": Decimal("39500.00"),
            "old_price": Decimal("48000.00"),
            "rating": Decimal("4.9"),
            "reviews_count": 210,
            "description": "Discover the perfect blend of style, comfort, and durability with our latest shoe collection — designed for everyday wear, but crafted to make a statement. Whether you're navigating city streets, heading to the office, or catching up with friends, these shoes are your go-to companion for every step.Made with premium materials and breathable lining, each pair ensures all-day comfort without compromising on design. The lightweight sole offers superior flexibility and shock absorption, reducing foot fatigue and keeping you energized throughout your day. Reinforced stitching and quality craftsmanship provide long-lasting wear, so your shoes look fresh—season after season.From modern minimalism to bold street-inspired looks, our collection is thoughtfully created to suit a variety of personal styles. Slip them on and experience a perfect fit, versatile design, and the confidence to move through life in comfort and style.",
            "material": "Mesh/Synthetic",
            "product_type": "Sneakers",
            "heel_type": "Flat Heel",
            "available_sizes": "S, M, L, XL, XXL",
            "weight": "0.9 kg",
            "image_url": "https://i.pinimg.com/1200x/13/6d/64/136d64900f4ac01432dc98f75881c54f.jpg"
        },
           {
            "name": "Stride Sneakers",
            "price": Decimal("32500.00"),
            "old_price": Decimal("41000.00"),
            "rating": Decimal("4.6"),
            "reviews_count": 210,
            "description": "Discover the perfect blend of style, comfort, and durability with our latest shoe collection — designed for everyday wear, but crafted to make a statement. Whether you're navigating city streets, heading to the office, or catching up with friends, these shoes are your go-to companion for every step.Made with premium materials and breathable lining, each pair ensures all-day comfort without compromising on design. The lightweight sole offers superior flexibility and shock absorption, reducing foot fatigue and keeping you energized throughout your day. Reinforced stitching and quality craftsmanship provide long-lasting wear, so your shoes look fresh—season after season.From modern minimalism to bold street-inspired looks, our collection is thoughtfully created to suit a variety of personal styles. Slip them on and experience a perfect fit, versatile design, and the confidence to move through life in comfort and style.",
            "material": "Mesh/Synthetic",
            "product_type": "Sneakers",
            "heel_type": "Flat Heel",
            "available_sizes": "S, M, L, XL, XXL",
            "weight": "0.9 kg",
            "image_url": "https://i.pinimg.com/1200x/21/39/c3/2139c3409cf829b2131e9315fe57eb45.jpg"
        },
        {
            "name": "Strideon Boot",
            "price": Decimal("44500.00"),
            "old_price": Decimal("52000.00"),
            "rating": Decimal("4.1"),
            "reviews_count": 210,
            "description": "Discover the perfect blend of style, comfort, and durability with our latest shoe collection — designed for everyday wear, but crafted to make a statement. Whether you're navigating city streets, heading to the office, or catching up with friends, these shoes are your go-to companion for every step.Made with premium materials and breathable lining, each pair ensures all-day comfort without compromising on design. The lightweight sole offers superior flexibility and shock absorption, reducing foot fatigue and keeping you energized throughout your day. Reinforced stitching and quality craftsmanship provide long-lasting wear, so your shoes look fresh—season after season.From modern minimalism to bold street-inspired looks, our collection is thoughtfully created to suit a variety of personal styles. Slip them on and experience a perfect fit, versatile design, and the confidence to move through life in comfort and style.",
            "material": "Leather",
            "product_type": "Boot",
            "heel_type": "Flat Heel",
            "available_sizes": "S, M, L, XL, XXL",
            "weight": "0.9 kg",
            "image_url": "https://cdn.prod.website-files.com/689251469afed457b38b7028/68926242b7c4f1a30b7667bf_image%20(2).png"
        },
         {
            "name": "Steve Maddens",
            "price": Decimal("42500.00"),
            "old_price": Decimal("49000.00"),
            "rating": Decimal("4.9"),
            "reviews_count": 210,
            "description": "Discover the perfect blend of style, comfort, and durability with our latest shoe collection — designed for everyday wear, but crafted to make a statement. Whether you're navigating city streets, heading to the office, or catching up with friends, these shoes are your go-to companion for every step.Made with premium materials and breathable lining, each pair ensures all-day comfort without compromising on design. The lightweight sole offers superior flexibility and shock absorption, reducing foot fatigue and keeping you energized throughout your day. Reinforced stitching and quality craftsmanship provide long-lasting wear, so your shoes look fresh—season after season.From modern minimalism to bold street-inspired looks, our collection is thoughtfully created to suit a variety of personal styles. Slip them on and experience a perfect fit, versatile design, and the confidence to move through life in comfort and style.",
            "material": "Leather",
            "product_type": "Boot",
            "heel_type": "Flat Heel",
            "available_sizes": "S, M, L, XL, XXL",
            "weight": "0.9 kg",
            "image_url": "https://i.pinimg.com/1200x/4d/7d/d2/4d7dd2491b5af08ae9716c456efeee16.jpg"
        },
         {
            "name": "Burgundy Heeled boots",
            "price": Decimal("49500.00"),
            "old_price": Decimal("55000.00"),
            "rating": Decimal("4.8"),
            "reviews_count": 210,
            "description": "Discover the perfect blend of style, comfort, and durability with our latest shoe collection — designed for everyday wear, but crafted to make a statement. Whether you're navigating city streets, heading to the office, or catching up with friends, these shoes are your go-to companion for every step.Made with premium materials and breathable lining, each pair ensures all-day comfort without compromising on design. The lightweight sole offers superior flexibility and shock absorption, reducing foot fatigue and keeping you energized throughout your day. Reinforced stitching and quality craftsmanship provide long-lasting wear, so your shoes look fresh—season after season.From modern minimalism to bold street-inspired looks, our collection is thoughtfully created to suit a variety of personal styles. Slip them on and experience a perfect fit, versatile design, and the confidence to move through life in comfort and style.",
            "material": "Leather",
            "product_type": "Boot",
            "heel_type": "Flat Heel",
            "available_sizes": "S, M, L, XL, XXL",
            "weight": "0.9 kg",
            "image_url": "https://i.pinimg.com/1200x/cb/af/c5/cbafc5065c96cbbea10ae39e73e522fc.jpg"
        },
        {
            "name": "Suede  boots",
            "price": Decimal("47500.00"),
            "old_price": Decimal("52000.00"),
            "rating": Decimal("4.8"),
            "reviews_count": 210,
            "description": "Discover the perfect blend of style, comfort, and durability with our latest shoe collection — designed for everyday wear, but crafted to make a statement. Whether you're navigating city streets, heading to the office, or catching up with friends, these shoes are your go-to companion for every step.Made with premium materials and breathable lining, each pair ensures all-day comfort without compromising on design. The lightweight sole offers superior flexibility and shock absorption, reducing foot fatigue and keeping you energized throughout your day. Reinforced stitching and quality craftsmanship provide long-lasting wear, so your shoes look fresh—season after season.From modern minimalism to bold street-inspired looks, our collection is thoughtfully created to suit a variety of personal styles. Slip them on and experience a perfect fit, versatile design, and the confidence to move through life in comfort and style.",
            "material": "Leather",
            "product_type": "Boot",
            "heel_type": "Flat Heel",
            "available_sizes": "S, M, L, XL, XXL",
            "weight": "0.9 kg",
            "image_url": "https://i.pinimg.com/736x/84/af/38/84af38b7ba660084aa87fed431ed418c.jpg"
        },
          {
            "name": "Formal Movo Shoe",
            "price": Decimal("14500.00"),
            "old_price": Decimal("16000.00"),
            "rating": Decimal("4.6"),
            "reviews_count": 210,
            "description": "Discover the perfect blend of style, comfort, and durability with our latest shoe collection — designed for everyday wear, but crafted to make a statement. Whether you're navigating city streets, heading to the office, or catching up with friends, these shoes are your go-to companion for every step.Made with premium materials and breathable lining, each pair ensures all-day comfort without compromising on design. The lightweight sole offers superior flexibility and shock absorption, reducing foot fatigue and keeping you energized throughout your day. Reinforced stitching and quality craftsmanship provide long-lasting wear, so your shoes look fresh—season after season.From modern minimalism to bold street-inspired looks, our collection is thoughtfully created to suit a variety of personal styles. Slip them on and experience a perfect fit, versatile design, and the confidence to move through life in comfort and style.",
            "material": "Leather",
            "product_type": "Formal",
            "heel_type": "Flat Heel",
            "available_sizes": "S, M, L, XL, XXL",
            "weight": "0.9 kg",
            "image_url": "https://cdn.prod.website-files.com/689251469afed457b38b7028/68a037b8ebc8cd2d4b3a6578_formal-movo.png"
        },
        {
            "name": "Formal Rovik Shoe",
            "price": Decimal("15500.00"),
            "old_price": Decimal("17000.00"),
            "rating": Decimal("4.7"),
            "reviews_count": 210,
            "description": "Discover the perfect blend of style, comfort, and durability with our latest shoe collection — designed for everyday wear, but crafted to make a statement. Whether you're navigating city streets, heading to the office, or catching up with friends, these shoes are your go-to companion for every step.Made with premium materials and breathable lining, each pair ensures all-day comfort without compromising on design. The lightweight sole offers superior flexibility and shock absorption, reducing foot fatigue and keeping you energized throughout your day. Reinforced stitching and quality craftsmanship provide long-lasting wear, so your shoes look fresh—season after season.From modern minimalism to bold street-inspired looks, our collection is thoughtfully created to suit a variety of personal styles. Slip them on and experience a perfect fit, versatile design, and the confidence to move through life in comfort and style.",
            "material": "Leather",
            "product_type": "Formal",
            "heel_type": "Flat Heel",
            "available_sizes": "S, M, L, XL, XXL",
            "weight": "0.9 kg",
            "image_url": "https://cdn.prod.website-files.com/689251469afed457b38b7028/6892663a641afcc78be81df2_image%20(4).png"
        },
         {
            "name": "Sam Edelman",
            "price": Decimal("19500.00"),
            "old_price": Decimal("22000.00"),
            "rating": Decimal("4.9"),
            "reviews_count": 210,
            "description": "Discover the perfect blend of style, comfort, and durability with our latest shoe collection — designed for everyday wear, but crafted to make a statement. Whether you're navigating city streets, heading to the office, or catching up with friends, these shoes are your go-to companion for every step.Made with premium materials and breathable lining, each pair ensures all-day comfort without compromising on design. The lightweight sole offers superior flexibility and shock absorption, reducing foot fatigue and keeping you energized throughout your day. Reinforced stitching and quality craftsmanship provide long-lasting wear, so your shoes look fresh—season after season.From modern minimalism to bold street-inspired looks, our collection is thoughtfully created to suit a variety of personal styles. Slip them on and experience a perfect fit, versatile design, and the confidence to move through life in comfort and style.",
            "material": "Leather",
            "product_type": "Formal",
            "heel_type": "Flat Heel",
            "available_sizes": "S, M, L, XL, XXL",
            "weight": "0.9 kg",
            "image_url": "https://i.pinimg.com/1200x/06/1a/96/061a96592e12859656553f03cf161fe3.jpg"
        },
        {
            "name": "White Loafers",
            "price": Decimal("16500.00"),
            "old_price": Decimal("18000.00"),
            "rating": Decimal("4.9"),
            "reviews_count": 210,
            "description": "Discover the perfect blend of style, comfort, and durability with our latest shoe collection — designed for everyday wear, but crafted to make a statement. Whether you're navigating city streets, heading to the office, or catching up with friends, these shoes are your go-to companion for every step.Made with premium materials and breathable lining, each pair ensures all-day comfort without compromising on design. The lightweight sole offers superior flexibility and shock absorption, reducing foot fatigue and keeping you energized throughout your day. Reinforced stitching and quality craftsmanship provide long-lasting wear, so your shoes look fresh—season after season.From modern minimalism to bold street-inspired looks, our collection is thoughtfully created to suit a variety of personal styles. Slip them on and experience a perfect fit, versatile design, and the confidence to move through life in comfort and style.",
            "material": "Leather",
            "product_type": "Formal",
            "heel_type": "Flat Heel",
            "available_sizes": "S, M, L, XL, XXL",
            "weight": "0.9 kg",
            "image_url": "https://i.pinimg.com/736x/0b/47/fb/0b47fbd5de0926ca16ed461a28d4caf0.jpg"
        },
        {
            "name": "Yono Loafers",
            "price": Decimal("15300.00"),
            "old_price": Decimal("15600.00"),
            "rating": Decimal("4.5"),
            "reviews_count": 150,
            "description": "Discover the perfect blend of style, comfort, and durability with our latest shoe collection — designed for everyday wear, but crafted to make a statement. Whether you're navigating city streets, heading to the office, or catching up with friends, these shoes are your go-to companion for every step.Made with premium materials and breathable lining, each pair ensures all-day comfort without compromising on design. The lightweight sole offers superior flexibility and shock absorption, reducing foot fatigue and keeping you energized throughout your day. Reinforced stitching and quality craftsmanship provide long-lasting wear, so your shoes look fresh—season after season.From modern minimalism to bold street-inspired looks, our collection is thoughtfully created to suit a variety of personal styles. Slip them on and experience a perfect fit, versatile design, and the confidence to move through life in comfort and style.",
            "material": "Leather",
            "product_type": "Slip-on",
            "heel_type": "Flat Heel",
            "available_sizes": "S, M, L, XL, XXL",
            "weight": "1.1 kg",
            "image_url": "https://i.pinimg.com/1200x/5a/3c/ee/5a3cee3137aeb0a6a542788182ae5e34.jpg"
        }
    ]
    
    for p in products:
        item = Product(**p)
        db.add(item)
    
    db.commit()
    print("Database seeded with 8 products!")
    db.close()

if __name__ == "__main__":
    seed()
