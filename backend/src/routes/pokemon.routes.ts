import { Router } from 'express';
import { searchPokemon, getPokemonDetails } from '../controllers/pokemon.controller';

const router = Router();

router.get('/search', searchPokemon);
router.get('/:nameOrId', getPokemonDetails);

export default router;
