import { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const category = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer"
]

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [carouselApi, setCarouselApi] = useState(null);

    useEffect(() => {
        if (!carouselApi) return undefined;

        const intervalId = window.setInterval(() => {
            carouselApi.scrollNext();
        }, 3000);

        return () => window.clearInterval(intervalId);
    }, [carouselApi]);

    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div>
            <Carousel
                className="w-full max-w-xl mx-auto my-20"
                opts={{ loop: true, align: 'start' }}
                setApi={setCarouselApi}
            >
                <CarouselContent>
                    {
                        category.map((cat) => (
                            <CarouselItem key={cat} className="md:basis-1/2 lg:basis-1/3">
                                <Button onClick={()=>searchJobHandler(cat)} variant="ghost" className="rounded-full border border-gray-200 bg-transparent hover:bg-transparent">{cat}</Button>
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>
                <CarouselPrevious className="bg-transparent hover:bg-transparent" />
                <CarouselNext className="bg-transparent hover:bg-transparent" />
            </Carousel>
        </div>
    )
}

export default CategoryCarousel