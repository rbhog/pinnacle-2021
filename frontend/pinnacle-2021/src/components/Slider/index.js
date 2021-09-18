import React, { useContext, useEffect, useState } from 'react';

import $ from 'jquery';

import 'ion-rangeslider';
import 'ion-rangeslider/css/ion.rangeSlider.min.css';

const Slider = () => {
  const [slider, setSlider] = useState(null);
  const [range, setRange] = useState([]);

  useEffect(() => {
    $('.js-range-slider').ionRangeSlider({ skin: 'square' });
    $('.js-range-slider').ionRangeSlider({
      type: 'double',
      min: 0,
      max: 1000,
      from: 200,
      to: 500,
      grid: true,
    });
  }, []);

  return (
    <div>
      <input type="text" className="js-range-slider" name="slider" />
    </div>
  );
};

export default Slider;
